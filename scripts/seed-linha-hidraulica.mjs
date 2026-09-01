/**
 * Adiciona os 43 produtos da categoria "Linha Hidráulica" (Figma, node 909:690),
 * divididos em 8 subcategorias.
 *
 * A categoria fica em layout "auto": cada grupo decide sozinho como aparecer.
 * Sete grupos são só nome + imagem e saem no compacto, em duas colunas;
 * "Tubos de aço de carbono" tem descrição e sai no layout padrão.
 *
 * Esse item é imagem + descrição e não tem nome próprio no Figma — o cabeçalho
 * do grupo faz esse papel — então ele é cadastrado com o nome do grupo, mesma
 * convenção usada nos quatro blocos equivalentes da Linha Pneumática.
 *
 * Os dados (nomes, descrição, subcategorias e ordem) foram extraídos do Figma
 * e ficam em linha-hidraulica-dados.json, ao lado deste arquivo.
 *
 * NÃO destrutivo: reaproveita a categoria (que já existe, vazia) e pula
 * produtos cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-linha-hidraulica.mjs         # dry-run
 *   node scripts/seed-linha-hidraulica.mjs --yes   # aplica
 *
 * Requer no .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error("❌ Faltam NEXT_PUBLIC_SANITY_PROJECT_ID e/ou SANITY_API_TOKEN no .env");
  process.exit(1);
}

const APLICAR = process.argv.includes("--yes");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const NOME_CATEGORIA = "Linha Hidráulica";
const ORDEM_CATEGORIA = 4;
const SRC = "linha-hidraulica-src";

const { subcategorias: SUBCATEGORIAS, produtos: PRODUTOS } = JSON.parse(
  readFileSync(resolve(__dirname, "linha-hidraulica-dados.json"), "utf8")
);

const dadosCategoria = {
  nome: NOME_CATEGORIA,
  slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
  layout: "auto",
  subcategorias: SUBCATEGORIAS.map((sub) => ({
    _type: "object",
    _key: slugify(sub.nome),
    nome: sub.nome,
    ordem: sub.ordem,
    ...(sub.pai ? { pai: sub.pai } : {}),
  })),
};

async function getOrCreateCategoria() {
  const existing = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });

  if (existing) {
    if (APLICAR) {
      await client.patch(existing._id).set(dadosCategoria).commit();
      console.log(`  📁 Categoria já existia, subcategorias/layout atualizados (${existing._id})`);
    } else {
      console.log(`  → categoria existente seria atualizada (${existing._id})`);
    }
    return existing._id;
  }

  if (!APLICAR) {
    console.log(`  → categoria "${NOME_CATEGORIA}" seria criada`);
    return null;
  }

  const created = await client.create({
    _type: "categoria",
    ...dadosCategoria,
    ordem: ORDEM_CATEGORIA,
  });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, SRC, arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔍 DRY-RUN (use --yes para aplicar)\n");

  // Falha cedo se faltar imagem: melhor abortar antes de criar meia categoria.
  for (const item of PRODUTOS) readFileSync(resolve(__dirname, SRC, item.arquivo));
  console.log(`🖼️  ${PRODUTOS.length} imagens encontradas em scripts/${SRC}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-linha-hidraulica`);
    const prefixo = `  [${i + 1}/${PRODUTOS.length}] ${item.nome}`;

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      console.log(`${prefixo}\n    ⏭️  já existe, pulando`);
      skipped++;
      continue;
    }

    if (!APLICAR) {
      console.log(`${prefixo}\n    → seria criado [${item.subcategoria}]`);
      created++;
      continue;
    }

    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
      subcategoria: item.subcategoria,
      ordem: item.ordem,
      ...(item.descricao ? { descricao: item.descricao } : {}),
    });
    console.log(`${prefixo}\n    ✅ criado`);
    created++;
  }

  console.log("\n========================================");
  console.log(
    APLICAR
      ? `✅ ${NOME_CATEGORIA}: ${created} criados, ${skipped} já existiam`
      : `🔍 Dry-run: ${created} seriam criados, ${skipped} já existem — nada foi alterado`
  );
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
