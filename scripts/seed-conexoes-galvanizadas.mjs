/**
 * Adiciona a categoria "Conexões galvanizadas e de aço inox" (novo Figma,
 * node 733:744) com seus 10 produtos. Lista simples, sem subcategoria —
 * mesmo padrão de Tubos e conexões PPR.
 *
 * NÃO destrutivo: cria a categoria só se ainda não existir, e pula produtos
 * cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-conexoes-galvanizadas.mjs --yes
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

if (!process.argv.includes("--yes")) {
  console.error(
    "Rode com --yes para confirmar:\n  node scripts/seed-conexoes-galvanizadas.mjs --yes"
  );
  process.exit(1);
}

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

const NOME_CATEGORIA = "Conexões galvanizadas e de aço inox";

async function getOrCreateCategoria() {
  const existing = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });
  if (existing) {
    console.log(`  📁 Categoria já existe: "${NOME_CATEGORIA}" (${existing._id})`);
    return existing._id;
  }
  const created = await client.create({
    _type: "categoria",
    nome: NOME_CATEGORIA,
    slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
    ordem: 12,
  });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, "conexoes-galvanizadas-src", arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const PRODUTOS = [
  {
    nome: "Cotovelo (Joelho) 90º",
    arquivo: "01-cotovelo-90.png",
    descricao: "Opções de diâmetro de 1/2” a 6”",
  },
  {
    nome: "Cotovelo (Joelho) 45º",
    arquivo: "02-cotovelo-45.png",
    descricao: "Opções de diâmetro de 1/4” a 6”",
  },
  {
    nome: "Curva Macho x Fêmea 90º",
    arquivo: "03-curva-macho-femea-90.png",
    descricao: "Opções de diâmetro de 1” a 4”",
  },
  {
    nome: "Luva",
    arquivo: "04-luva.png",
    descricao: "Opções de diâmetro de 1/4” a 6”",
  },
  {
    nome: "Luva de Redução",
    arquivo: "05-luva-reducao.png",
    descricao: "Opções de diâmetro de 3/8”x 1/4” a 4”x 3”",
  },
  {
    nome: "Niple Duplo",
    arquivo: "06-niple-duplo.png",
    descricao: "Opções de diâmetro de 1/4” a 6”",
  },
  {
    nome: "Niple Redução",
    arquivo: "07-niple-reducao.png",
    descricao: "Opções de diâmetro de 3/8”x 1/4” a 4”x 3”",
  },
  {
    nome: "Tee 45º",
    arquivo: "08-tee-45.png",
    descricao: "Opções de diâmetro de 1/2” a 4”",
  },
  {
    nome: "Tee 90º",
    arquivo: "09-tee-90.png",
    descricao: "Opções de diâmetro de 1/4” a 6”",
  },
  {
    nome: "União com Assento Cônico em Bronze",
    arquivo: "10-uniao-assento-conico-bronze.png",
    descricao: "Opções de diâmetro de 1/4” a 6”",
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos — Conexões galvanizadas e de aço inox (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;
  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-conexoes-galvanizadas`);
    console.log(`  [${i + 1}/${PRODUTOS.length}] ${item.nome}`);

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      console.log(`    ⏭️  já existe, pulando`);
      skipped++;
      continue;
    }

    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      descricao: item.descricao,
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
    });
    created++;
  }

  console.log("\n========================================");
  console.log(`✅ Conexões galvanizadas e de aço inox: ${created} criados, ${skipped} já existiam`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
