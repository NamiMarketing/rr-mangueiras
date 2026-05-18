/**
 * Importação de produtos a partir do arquivo "Produtos RR.xlsx"
 *
 * Uso:
 *   node scripts/import-xlsx.mjs "./src/file/Produtos RR.xlsx"
 *
 * Colunas do Excel:
 *   [0] Descricao Item → nome
 *   [1] Familia        → marca
 *   [2] Grande Grupo   → categoria (mapeado para os nomes do Sanity)
 *   [3] Grupo          → tipo
 *   [4] Sub Grupo      → subcategoria
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error("❌ PROJECT_ID ou TOKEN não encontrados no .env");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Mapeamento: valores do Excel → nomes de categoria no Sanity
const CATEGORIA_MAP = {
  "ABRAÇADEIRAS":        "Abraçadeiras",
  "ADAPTADOR":           "Adaptadores",
  "BICOS PARA MANGUEIRAS": "Mangueiras",
  "COMPRESSÃO":          "Conexões",
  "CONEXOES":            "Conexões",
  "CORREIAS":            "Correias",
  "ENGATE RÁPIDO":       "Engates",
  "ENGATES":             "Engates",
  "ESPIRAIS":            "Tubos metálicos flexíveis",
  "FREIO":               "Terminais hidráulicos",
  "INSTANTÊNEAS":        "Conexões",
  "MANGUEIRAS":          "Mangueiras",
  "TERMINAIS":           "Terminais hidráulicos",
  "TUBOS":               "Tubos",
  "VALVULA":             "Válvulas",
};

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

async function getOrCreateCategoria(nomeCategoria) {
  const existing = await client.fetch(
    `*[_type == "categoria" && nome == $nome][0]{ _id }`,
    { nome: nomeCategoria }
  );
  if (existing) return existing._id;

  console.log(`  📁 Criando categoria: ${nomeCategoria}`);
  const created = await client.create({
    _type: "categoria",
    nome: nomeCategoria,
    slug: { _type: "slug", current: slugify(nomeCategoria) },
  });
  return created._id;
}

async function main() {
  const xlsxPath = process.argv[2];
  if (!xlsxPath) {
    console.error('❌ Uso: node scripts/import-xlsx.mjs "./src/file/Produtos RR.xlsx"');
    process.exit(1);
  }

  console.log("🚀 Iniciando importação de produtos...");
  console.log(`📄 Arquivo: ${xlsxPath}`);
  console.log(`📦 Projeto: ${PROJECT_ID} / ${DATASET}\n`);

  const wb = XLSX.readFile(resolve(xlsxPath));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  // Filtrar linhas com dados (coluna 0 não vazia)
  const dados = rows.slice(1).filter((r) => r[0] && r[0].toString().trim() !== "");
  console.log(`📋 ${dados.length} produtos encontrados\n`);

  const categoriaCache = {};
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < dados.length; i++) {
    const row = dados[i];
    const nome         = (row[0] || "").toString().trim();
    const marca        = (row[1] || "").toString().trim();
    const grandeGrupo  = (row[2] || "").toString().trim().toUpperCase();
    const tipo         = (row[3] || "").toString().trim();
    const subcategoria = (row[4] || "").toString().trim();

    const nomeCategoria = CATEGORIA_MAP[grandeGrupo];

    console.log(`[${i + 1}/${dados.length}] ${nome} | ${marca} | ${grandeGrupo}`);

    if (!nome || !marca || !tipo) {
      console.error(`  ❌ Campos obrigatórios faltando. Pulando.`);
      errorCount++;
      continue;
    }

    if (!nomeCategoria) {
      console.warn(`  ⚠️  Categoria desconhecida: "${grandeGrupo}". Pulando.`);
      errorCount++;
      continue;
    }

    try {
      if (!categoriaCache[nomeCategoria]) {
        categoriaCache[nomeCategoria] = await getOrCreateCategoria(nomeCategoria);
      }
      const categoriaId = categoriaCache[nomeCategoria];

      const slugText = `${nome}-${marca}-${tipo}`;
      const slug = slugify(slugText);

      const existing = await client.fetch(
        `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      if (existing) {
        console.log(`  ⏭️  Já existe. Pulando.`);
        skippedCount++;
        continue;
      }

      const doc = {
        _type: "produto",
        nome,
        slug: { _type: "slug", current: slug },
        marca,
        tipo,
        categoria: { _type: "reference", _ref: categoriaId },
      };

      if (subcategoria) doc.subcategoria = subcategoria;

      await client.create(doc);
      console.log(`  ✅ Importado!`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Erro: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log(`✅ Importados:  ${successCount}`);
  console.log(`⏭️  Pulados:     ${skippedCount}`);
  console.log(`❌ Erros:       ${errorCount}`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
