/**
 * Ajustes.xlsx, aba "pneumatica": "INCLUIR OS 4 ITENS ABAIXO NO SITE".
 *
 * Três deles (8554/8555/8556, os silenciadores) já existiam e foram movidos
 * por scripts/ajuste-latao-pneumatica.mjs. Falta o 8505 União Fêmea, que não
 * existia no Sanity.
 *
 * Vai para Linha Pneumática › Milímetro (subgrupo "Conexões Pneumáticas").
 * Sem descrição — nenhum dos oito vizinhos da subcategoria tem, e a planilha
 * também não traz uma.
 *
 * Idempotente: se o slug já existir, não faz nada.
 *
 *   node scripts/incluir-8505-uniao-femea.mjs          # simulação
 *   node scripts/incluir-8505-uniao-femea.mjs --yes    # aplica
 *
 * Requer em .env.local ou .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env.local"), quiet: true });
config({ path: resolve(__dirname, "..", ".env"), quiet: true });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;
if (!PROJECT_ID || !TOKEN) {
  console.error("❌ Faltam NEXT_PUBLIC_SANITY_PROJECT_ID e/ou SANITY_API_TOKEN");
  process.exit(1);
}
const APLICAR = process.argv.includes("--yes");

const client = createClient({
  projectId: PROJECT_ID, dataset: DATASET, token: TOKEN,
  apiVersion: "2024-01-01", useCdn: false,
});

const CATEGORIA = "Linha Pneumática";
const SUBCATEGORIA = "Milímetro";
const ARQUIVO = "linha-pneumatica-src/8505-uniao-femea.png";

// Mesmo padrão dos vizinhos: <nome-sem-código>-<código>-linha-pneumatica
const ITEM = {
  nome: "8505 União Fêmea",
  slug: "uniao-femea-8505-linha-pneumatica",
  ordem: 8505,
};

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const caminho = resolve(__dirname, ARQUIVO);
  if (!existsSync(caminho)) {
    console.error(`❌ arquivo não encontrado: scripts/${ARQUIVO}`);
    process.exit(1);
  }

  const categoria = await client.fetch(
    `*[_type=="categoria" && nome==$n][0]{_id, subcategorias[]{nome}}`, { n: CATEGORIA });
  if (!categoria) { console.error(`❌ categoria "${CATEGORIA}" não encontrada`); process.exit(1); }

  // A subcategoria é uma string solta casada por igualdade exata — se não
  // estiver cadastrada na categoria, o produto nasceria fora de qualquer grupo.
  const temSub = (categoria.subcategorias ?? []).some((s) => s.nome === SUBCATEGORIA);
  if (!temSub) {
    console.error(`❌ subcategoria "${SUBCATEGORIA}" não existe em "${CATEGORIA}".`);
    console.error(`   existentes: ${(categoria.subcategorias ?? []).map((s) => s.nome).join(" | ")}`);
    process.exit(1);
  }

  const jaExiste = await client.fetch(
    `*[_type=="produto" && slug.current==$s][0]{_id,nome}`, { s: ITEM.slug });
  if (jaExiste) {
    console.log(`⏭️  já existe: "${jaExiste.nome}" (${jaExiste._id}). Nada a fazer.`);
    return;
  }

  const kb = (readFileSync(caminho).length / 1024).toFixed(0);
  console.log("Vai criar:");
  console.log(`  nome         : ${ITEM.nome}`);
  console.log(`  slug         : ${ITEM.slug}`);
  console.log(`  categoria    : ${CATEGORIA}`);
  console.log(`  subcategoria : ${SUBCATEGORIA}`);
  console.log(`  ordem        : ${ITEM.ordem}`);
  console.log(`  descrição    : (nenhuma — igual aos vizinhos)`);
  console.log(`  imagem       : scripts/${ARQUIVO} (${kb} KB)`);

  const vizinhos = await client.fetch(
    `*[_type=="produto" && subcategoria==$s]|order(coalesce(ordem,0) asc){nome,ordem}`,
    { s: SUBCATEGORIA });
  console.log(`\nOrdem resultante em "${SUBCATEGORIA}":`);
  for (const v of [...vizinhos, { nome: ITEM.nome, ordem: ITEM.ordem, novo: true }]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)))
    console.log(`  ${String(v.ordem).padStart(5)}  ${v.nome}${v.novo ? "   ← novo" : ""}`);

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  const asset = await client.assets.upload("image", readFileSync(caminho), {
    filename: "8505-uniao-femea.png", contentType: "image/png",
  });
  const doc = await client.create({
    _type: "produto",
    nome: ITEM.nome,
    slug: { _type: "slug", current: ITEM.slug },
    subcategoria: SUBCATEGORIA,
    ordem: ITEM.ordem,
    imagem: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    categoria: { _type: "reference", _ref: categoria._id },
  });
  console.log(`\n✅ criado: ${doc._id}`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
