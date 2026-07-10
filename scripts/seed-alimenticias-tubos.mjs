/**
 * Adiciona os produtos das categorias "Alimentícias e sanitárias" e
 * "Tubos e conexões PPR" (novo Figma, node 664:128 e 669:297).
 *
 * NÃO destrutivo: renomeia (patch) as categorias vazias já existentes em vez
 * de apagar/recriar, e pula produtos cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-alimenticias-tubos.mjs --yes
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
    "Rode com --yes para confirmar:\n  node scripts/seed-alimenticias-tubos.mjs --yes"
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

// Renomeia a categoria existente (patch) em vez de criar uma nova.
// Se já foi renomeada numa execução anterior, ou já existir com o nome novo,
// reaproveita o _id existente.
async function renameOrCreateCategoria(nomeAntigo, nomeNovo, subcategorias) {
  let doc = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: nomeNovo,
  });

  if (!doc) {
    doc = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
      nome: nomeAntigo,
    });
  }

  const patchData = {
    nome: nomeNovo,
    slug: { _type: "slug", current: slugify(nomeNovo) },
  };
  if (subcategorias) {
    patchData.subcategorias = subcategorias.map((nome) => ({
      _type: "object",
      _key: slugify(nome),
      nome,
    }));
  }

  if (doc) {
    await client.patch(doc._id).set(patchData).commit();
    console.log(`  📁 Categoria "${nomeAntigo}" → "${nomeNovo}" (${doc._id})`);
    return doc._id;
  }

  const created = await client.create({ _type: "categoria", ...patchData, ordem: 99 });
  console.log(`  📁 Categoria criada: "${nomeNovo}" (${created._id})`);
  return created._id;
}

async function uploadImage(dir, arquivo) {
  const buffer = readFileSync(resolve(__dirname, dir, arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// ── Alimentícias e sanitárias — só os 5 itens já conferidos (imagem + texto corretos) ──
const ALIMENTICIAS = [
  {
    nome: "Mangueira de Borracha Atóxica Trama Simples",
    arquivo: "01-mangueira-atoxica-trama-simples.png",
    subcategoria: "Mangueiras",
    descricao:
      "Disponível em diferentes bitolas — 3/4”, 1”, 1 ½”, 2”, 2 ½”, 3” e 4”. Suporta pressão até 7 bar e temperaturas de até 100°C durante os processos de higienização. Apresenta alta resistência química, sendo compatível com agentes utilizados em processos de limpeza CIP, como: Hidróxido de sódio, Ácido nítrico, Ácido acético e Hipoclorito de sódio.",
  },
  {
    nome: "Mangueira de Borracha Atóxica Trama Dupla",
    arquivo: "02-mangueira-atoxica-trama-dupla.png",
    subcategoria: "Mangueiras",
    descricao:
      "Disponível em bitolas de 2”, 3” e 4”. Suporta pressão até 10 bar e temperaturas entre -30°C e +100°C. Indicada para: Transporte de glucose, Sucção e descarga de alimentos secos a granel, Processos industriais do setor alimentício, Aplicações que exigem maior resistência à pressão.",
  },
  {
    nome: "Mangueira de Borracha Atóxica Pressão",
    arquivo: "03-mangueira-atoxica-pressao.png",
    subcategoria: "Mangueiras",
    descricao:
      "Recomendadas para o uso em mangueiras de material semirígido, aplicações em sistema de arrefecimento veiculares (radiadores), instalações industriais e fixação de elementos (placas, antenas, luminosos e outros itens) devido a sua grande capacidade de aperto e dimensões reduzidas.",
  },
  {
    nome: "Ponteira INOX DIN",
    arquivo: "04-ponteira-inox-din.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras de 3/4”, 1”, 1 1/2”, 2”, 2 1/2”, 3”, 4”",
  },
  {
    nome: "Ponteira INOX RJT Fêmea e Macho",
    arquivo: "05-ponteira-inox-rjt.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras de 3/4”, 1”, 1 1/2”, 2”, 2 1/2”, 3”, 4”",
  },
  {
    nome: "Ponteira INOX SMS Fêmea e Macho",
    arquivo: "06-ponteira-inox-sms.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras Fêmea de 1 1/2”, 2”, 2 1/2”, 3”, 4” e Macho 2”",
  },
  {
    nome: "Ponteira INOX BSP Roscada",
    arquivo: "07-ponteira-inox-bsp.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras 3/4”, 1”, 1 1/2”, 2”, 2 1/2”, 3”, 4”",
  },
  {
    nome: "Engate INOX TC",
    arquivo: "08-engate-inox-tc.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras de 3/4”, 1”, 1 1/2”, 2”, 2 1/2”, 3”",
  },
  {
    nome: "Engate Rápido INOX Macho",
    arquivo: "09-engate-rapido-inox-macho.png",
    subcategoria: "Conexões",
    descricao: "Disponível para mangueiras de 3”, 4x2”, 4x2 ½”, 4x3 e 4”",
  },
  {
    nome: "Válvula Borboleta com catraca/alavanca",
    arquivo: "10-valvula-borboleta-catraca.png",
    subcategoria: "Válvulas",
    descricao:
      "Disponível nos diâmetros de 1” até 8”, com pressão máxima de trabalho de 10 bar. Cada tipo de vedação atende uma temperatura específica. Com 2 opções de acionamento, por manípulo tipo catraca ou por manípulo retrátil.",
  },
  {
    nome: "Válvula Borboleta tipo Wafer",
    arquivo: "11-valvula-borboleta-wafer.png",
    subcategoria: "Válvulas",
    descricao:
      "Disponível nos diâmetros DN 40 a DN 600 (1½” a 24”), com pressão máxima de trabalho de até 16 bar (232 psi), conforme diâmetro, material de construção e condições de operação. Cada tipo de vedação atende uma temperatura específica.",
  },
  {
    nome: "Válvula de retenção",
    arquivo: "12-valvula-retencao.png",
    subcategoria: "Válvulas",
    descricao:
      "Disponível nos diâmetros de 1” a 4” (DN25 a DN100), com pressão máxima de trabalho de até 10 bar (145 psi), podendo variar conforme o modelo e a vedação utilizada. Cada tipo de vedação atende uma temperatura específica.",
  },
];

// ── Tubos e conexões PPR — os 12 itens, todos conferidos ──
const TUBOS_CONEXOES = [
  { nome: "Tubo 3m", arquivo: "01-tubo-3m.png", descricao: "Bitolas: 20mm até 90mm" },
  { nome: "Adaptador", arquivo: "02-adaptador.png", descricao: "Bitolas: 20 x 1/2” até 90 x 3”" },
  { nome: "Bucha Redução", arquivo: "03-bucha-reducao.png", descricao: "Bitolas: 25 x 20 até 90 x 75" },
  { nome: "CAP", arquivo: "04-cap.png", descricao: "Bitolas: 20mm até 90mm" },
  { nome: "Curva U 180°", arquivo: "05-curva-u-180.png", descricao: "Bitolas: 20mm até 32mm" },
  { nome: "Joelho 45°", arquivo: "06-joelho-45.png", descricao: "Bitolas: 20mm até 90mm" },
  { nome: "Joelho Misto 90°", arquivo: "07-joelho-misto-90.png", descricao: "Bitolas: 20 x 1/2” até 63 x 2”" },
  { nome: "Joelho 90°", arquivo: "08-joelho-90.png", descricao: "Bitolas: 20mm até 90mm" },
  { nome: "Luva Mista", arquivo: "09-luva-mista.png", descricao: "Bitolas: 20 x 1/2” até 90 x 3”" },
  { nome: "Luva", arquivo: "10-luva.png", descricao: "Bitolas: 20mm até 90mm" },
  { nome: "Suporte c/ Trava", arquivo: "11-suporte-c-trava.png", descricao: "Bitolas: 20mm até 40mm" },
  { nome: "Tee", arquivo: "12-tee.png", descricao: "Bitolas: 20mm até 90mm" },
];

async function seedCategoria({ categoriaId, itens, imgDir, slugSuffix }) {
  let created = 0;
  let skipped = 0;
  for (let i = 0; i < itens.length; i++) {
    const item = itens[i];
    const slug = slugify(`${item.nome}-${slugSuffix}`);
    console.log(`  [${i + 1}/${itens.length}] ${item.nome}`);

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      console.log(`    ⏭️  já existe, pulando`);
      skipped++;
      continue;
    }

    const imagem = await uploadImage(imgDir, item.arquivo);
    const doc = {
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      descricao: item.descricao,
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
    };
    if (item.subcategoria) doc.subcategoria = item.subcategoria;

    await client.create(doc);
    created++;
  }
  return { created, skipped };
}

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("📁 Categorias:");
  const alimentaciasId = await renameOrCreateCategoria(
    "Linha Alimentícia",
    "Alimentícias e sanitárias",
    ["Mangueiras", "Conexões", "Válvulas"]
  );
  const tubosId = await renameOrCreateCategoria("Tubos e Conexões", "Tubos e conexões PPR");

  console.log("\n🔧 Produtos — Alimentícias e sanitárias (12 de 12):");
  const rAlim = await seedCategoria({
    categoriaId: alimentaciasId,
    itens: ALIMENTICIAS,
    imgDir: "alimenticias-src",
    slugSuffix: "alimenticias-sanitarias",
  });

  console.log("\n🔧 Produtos — Tubos e conexões PPR (12 de 12):");
  const rTubos = await seedCategoria({
    categoriaId: tubosId,
    itens: TUBOS_CONEXOES,
    imgDir: "tubos-conexoes-src",
    slugSuffix: "tubos-conexoes-ppr",
  });

  console.log("\n========================================");
  console.log(`✅ Alimentícias e sanitárias: ${rAlim.created} criados, ${rAlim.skipped} já existiam`);
  console.log(`✅ Tubos e conexões PPR:      ${rTubos.created} criados, ${rTubos.skipped} já existiam`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
