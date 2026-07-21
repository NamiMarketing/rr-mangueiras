/**
 * Adiciona a categoria "Engates" (novo Figma, node 738:348) com seus 12
 * produtos, divididos em 2 subcategorias: Engate Rápido Universal (ERU) Mão
 * Amigo e Engate Camlock (ERT).
 *
 * NÃO destrutivo: renomeia (patch) a categoria "Engate" vazia já existente
 * em vez de criar uma nova, e pula produtos cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-engates.mjs --yes
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
  console.error("Rode com --yes para confirmar:\n  node scripts/seed-engates.mjs --yes");
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

const NOME_ANTIGO = "Engate";
const NOME_CATEGORIA = "Engates";
const SUBCATEGORIAS = ["Engate Rápido Universal (ERU) Mão Amigo", "Engate Camlock (ERT)"];

async function renameOrCreateCategoria() {
  let doc = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });
  if (!doc) {
    doc = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
      nome: NOME_ANTIGO,
    });
  }

  const patchData = {
    nome: NOME_CATEGORIA,
    slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
    subcategorias: SUBCATEGORIAS.map((nome) => ({
      _type: "object",
      _key: slugify(nome),
      nome,
    })),
  };

  if (doc) {
    await client.patch(doc._id).set(patchData).commit();
    console.log(`  📁 Categoria "${NOME_ANTIGO}" → "${NOME_CATEGORIA}" (${doc._id})`);
    return doc._id;
  }

  const created = await client.create({ _type: "categoria", ...patchData, ordem: 9 });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, "engates-src", arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const PRODUTOS = [
  // ── Engate Rápido Universal (ERU) Mão Amigo ──
  {
    nome: "ERU-M Rosca Macho",
    arquivo: "01-eru-m-rosca-macho.png",
    subcategoria: "Engate Rápido Universal (ERU) Mão Amigo",
    descricao: "Opções de diâmetros 1/2”, 3/4” e 1”, rosca NPT",
  },
  {
    nome: "ERU-F Rosca Fêmea",
    arquivo: "02-eru-f-rosca-femea.png",
    subcategoria: "Engate Rápido Universal (ERU) Mão Amigo",
    descricao: "Opções de diâmetros 1/2”, 3/4” e 1”, rosca NPT",
  },
  {
    nome: "ERU-E Espigão para Mangueira",
    arquivo: "03-eru-e-espigao-mangueira.png",
    subcategoria: "Engate Rápido Universal (ERU) Mão Amigo",
    descricao: "Opções de diâmetros 1/2”, 3/4” e 1”, rosca NPT",
  },
  {
    nome: "ERU-T Tampão",
    arquivo: "04-eru-t-tampao.png",
    subcategoria: "Engate Rápido Universal (ERU) Mão Amigo",
    descricao: "Opções de diâmetros 1/2”, 3/4” e 1”, rosca NPT",
  },
  // ── Engate Camlock (ERT) ──
  {
    nome: "ERT-A Adaptador Rosca Fêmea",
    arquivo: "05-ert-a-adaptador-rosca-femea.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Opções de Diâmetros: de 1/2”a 6” ( 5” exclusivamente em inox)",
  },
  {
    nome: "ERT-B Acoplador Rosca Macho",
    arquivo: "06-ert-b-acoplador-rosca-macho.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Pressão de trabalho: 1/2” até 4”: 150 PSI - 05” e 6”: 75 PSI",
  },
  {
    nome: "ERT-C Acoplador Espigão",
    arquivo: "07-ert-c-acoplador-espigao.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Opções de Diâmetros: de 1/2”a 6” ( 5” exclusivamente em inox)",
  },
  {
    nome: "ERT-D Acoplador Rosca Fêmea",
    arquivo: "08-ert-d-acoplador-rosca-femea.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Pressão de trabalho: 1/2” até 4”: 150 PSI - 05” e 6”: 75 PSI",
  },
  {
    nome: "ERT-E Adaptador Espigão",
    arquivo: "09-ert-e-adaptador-espigao.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Opções de Diâmetros: de 1/2”a 6” ( 5” exclusivamente em inox)",
  },
  {
    nome: "ERT-F Adaptador Rosca Macho",
    arquivo: "10-ert-f-adaptador-rosca-macho.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Pressão de trabalho: 1/2” até 4”: 150 PSI - 05” e 6”: 75 PSI",
  },
  {
    nome: "ERT-DC Acoplador Tampa",
    arquivo: "11-ert-dc-acoplador-tampa.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Opções de Diâmetros: de 1/2”a 6” ( 5” exclusivamente em inox)",
  },
  {
    nome: "ERT-DP Adaptador Tampão",
    arquivo: "12-ert-dp-adaptador-tampao.png",
    subcategoria: "Engate Camlock (ERT)",
    descricao: "Pressão de trabalho: 1/2” até 4”: 150 PSI - 05” e 6”: 75 PSI",
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await renameOrCreateCategoria();

  console.log(`\n🔧 Produtos — Engates (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;
  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-engates`);
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
      subcategoria: item.subcategoria,
    });
    created++;
  }

  console.log("\n========================================");
  console.log(`✅ Engates: ${created} criados, ${skipped} já existiam`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
