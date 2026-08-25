/**
 * Adiciona a categoria "Válvulas industriais" (Figma, node 872:713) com seus
 * 28 produtos, divididos em 5 subcategorias.
 *
 * Catálogo compacto — só nome e imagem — então a categoria nasce com
 * `layout: "compacto"`. Quatro itens têm uma nota curta (ex: "Disponível com
 * sedes de vedação metálica"), que o layout compacto rende como uma linha em
 * itálico sob o nome, sem abrir coluna de descrição.
 *
 * A `ordem` das subcategorias reproduz o pareamento de colunas do Figma:
 * VEM + VEB + direcionais na 1ª coluna, VET + diversas na 2ª.
 *
 * NÃO destrutivo: reaproveita a categoria se já existir e pula produtos cujo
 * slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-valvulas-industriais.mjs         # dry-run
 *   node scripts/seed-valvulas-industriais.mjs --yes   # aplica
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

const NOME_CATEGORIA = "Válvulas industriais";
const ORDEM_CATEGORIA = 15;
const SRC = "valvulas-industriais-src";

const VEM = "VEM - Válvulas de esfera monobloco";
const VEB = "VEB - Válvulas de esfera bipartidas";
const DIRECIONAIS = "Válvulas direcionais";
const VET = "VET - Válvulas de esfera tripartidas";
const DIVERSAS = "Válvulas diversas";

const NOTA_METALICA = "Disponível com sedes de vedação metálica";

// A ordem abaixo pareia as colunas como no Figma: com `columns: 2` no CSS, os
// três primeiros grupos enchem a coluna da esquerda.
const SUBCATEGORIAS = [
  { nome: VEM, ordem: 1 },
  { nome: VEB, ordem: 2 },
  { nome: DIRECIONAIS, ordem: 3 },
  { nome: VET, ordem: 4 },
  { nome: DIVERSAS, ordem: 5 },
];

const PRODUTOS = [
  // ── VEM - Válvulas de esfera monobloco ──
  { nome: "VEM 1000 WOG", arquivo: "01-vem-1000-wog.png", subcategoria: VEM, ordem: 1 },
  { nome: "VEM Latão Forjado Mini", arquivo: "02-vem-latao-forjado-mini.png", subcategoria: VEM, ordem: 2 },
  { nome: "VEM para Fundo de Caldeira Wafer Classe 150 / Wafer Flangeada Classe 150", arquivo: "03-vem-fundo-de-caldeira.png", subcategoria: VEM, ordem: 3 },
  { nome: "VEM Latão Forjado PN 25 / PN 25 - DNR / PN 30", arquivo: "04-vem-latao-forjado-pn25.png", subcategoria: VEM, ordem: 4 },

  // ── VEB - Válvulas de esfera bipartidas ──
  { nome: "VEB Flange Classes 150/300/600", arquivo: "14-veb-flange-classes-150-300-600.png", subcategoria: VEB, ordem: 1, descricao: NOTA_METALICA },
  { nome: "VEB Duplex e Super Duplex Flange Classes 150/300", arquivo: "15-veb-duplex-super-duplex.png", subcategoria: VEB, ordem: 2, descricao: "Disponível na construção Fire Safe" },
  { nome: "VEB Criogênica Classe 150/300", arquivo: "16-veb-criogenica-classe-150-300.png", subcategoria: VEB, ordem: 3 },

  // ── Válvulas direcionais ──
  { nome: "VED-M Multivias", arquivo: "17-ved-m-multivias.png", subcategoria: DIRECIONAIS, ordem: 1 },
  { nome: "Multivias Flange Classes 150 / 300 / DIN", arquivo: "18-multivias-flange-150-300-din.png", subcategoria: DIRECIONAIS, ordem: 2 },
  { nome: "Multivias 04 Vias Classe 300", arquivo: "19-multivias-04-vias-classe-300.png", subcategoria: DIRECIONAIS, ordem: 3 },
  { nome: "Multivias 04 Vias Flange Classe 150 / 300 / DIN", arquivo: "20-multivias-04-vias-flange.png", subcategoria: DIRECIONAIS, ordem: 4 },
  { nome: "Multivias 180º Classe 300", arquivo: "21-multivias-180-classe-300.png", subcategoria: DIRECIONAIS, ordem: 5 },
  { nome: "Multivias 180º Flange Classe 150 / 300 / DIN", arquivo: "22-multivias-180-flange.png", subcategoria: DIRECIONAIS, ordem: 6 },

  // ── VET - Válvulas de esfera tripartidas ──
  { nome: "VET Latão Forjado Classe 300", arquivo: "05-vet-latao-forjado-classe-300.png", subcategoria: VET, ordem: 1 },
  { nome: "VET 400Psi com Conexão para Tubo OD", arquivo: "06-vet-400psi-tubo-od.png", subcategoria: VET, ordem: 2 },
  { nome: "VET Flange Classe 150", arquivo: "07-vet-flange-classe-150.png", subcategoria: VET, ordem: 3 },
  { nome: "VET Flutuante Classe 1500", arquivo: "08-vet-flutuante-classe-1500.png", subcategoria: VET, ordem: 4, descricao: NOTA_METALICA },
  { nome: "VET Trunnion Classe 1500", arquivo: "09-vet-trunnion-classe-1500.png", subcategoria: VET, ordem: 5, descricao: NOTA_METALICA },
  { nome: "VET Série 1000 Flange Classe 300", arquivo: "10-vet-serie-1000-flange-classe-300.png", subcategoria: VET, ordem: 6 },
  { nome: "VETD Direcional de Fluxo Flange Classe 150 “T” e “L”", arquivo: "11-vetd-direcional-flange-classe-150.png", subcategoria: VET, ordem: 7 },
  { nome: "VETD Direcional de Fluxo Classe 300 “T” e “L”", arquivo: "12-vetd-direcional-classe-300.png", subcategoria: VET, ordem: 8 },
  { nome: "VET Forjada Classe 800", arquivo: "13-vet-forjada-classe-800.png", subcategoria: VET, ordem: 9 },

  // ── Válvulas diversas ──
  { nome: "VF Visores de Fluxo", arquivo: "23-vf-visores-de-fluxo.png", subcategoria: DIVERSAS, ordem: 1 },
  { nome: "Junta de Expansão", arquivo: "24-junta-de-expansao.png", subcategoria: DIVERSAS, ordem: 2 },
  { nome: "VG - Válvula Gaveta Classe 150", arquivo: "25-vg-valvula-gaveta-classe-150.png", subcategoria: DIVERSAS, ordem: 3 },
  { nome: "Atuador Pneumático DA/SR", arquivo: "26-atuador-pneumatico-da-sr.png", subcategoria: DIVERSAS, ordem: 4 },
  { nome: "VB - Válvula Borboleta Tipo Wafer Classe 150", arquivo: "27-vb-borboleta-wafer-classe-150.png", subcategoria: DIVERSAS, ordem: 5 },
  { nome: "VB - Válvula Borboleta Tipo Wafer em PTFE Classe 1", arquivo: "28-vb-borboleta-wafer-ptfe-classe-1.png", subcategoria: DIVERSAS, ordem: 6 },
];

const dadosCategoria = {
  nome: NOME_CATEGORIA,
  slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
  layout: "compacto",
  subcategorias: SUBCATEGORIAS.map((sub) => ({
    _type: "object",
    _key: slugify(sub.nome),
    nome: sub.nome,
    ordem: sub.ordem,
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
    console.log(`  → categoria "${NOME_CATEGORIA}" seria criada (ordem ${ORDEM_CATEGORIA}, layout compacto)`);
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
  for (const item of PRODUTOS) {
    readFileSync(resolve(__dirname, SRC, item.arquivo));
  }
  console.log(`🖼️  ${PRODUTOS.length} imagens encontradas em scripts/${SRC}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-valvulas-industriais`);
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
