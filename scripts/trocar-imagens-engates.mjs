/**
 * Ajustes.xlsx, aba "Engates": coluna IMAGEM traz a URL de origem de cada um
 * dos 8 ERT (Camlock), em delcaflex.com.br. Inclui o "Atualizar foto no site
 * e catálogo" que a planilha marca no ERT-C.
 *
 * As imagens já foram baixadas para scripts/engates-delcaflex-src/ — 1280×1024,
 * PNG com transparência. A numeração dos arquivos segue a de scripts/engates-src/
 * (05 a 12 são os ERT; 01 a 04 são os ERU, que a planilha não manda trocar).
 *
 * Duas duplas tinham nome de arquivo ambíguo na planilha (ERT-A/ERT-F e
 * ERT-B/ERT-D, em que só um dos dois traz "macho"/"femea" no nome). Conferido
 * na imagem: A = rosca fêmea, F = rosca macho, B = acoplador rosca macho,
 * D = acoplador rosca fêmea. O mapeamento da planilha está certo.
 *
 * Não mexe em nome, descrição, categoria nem subcategoria. O asset antigo fica
 * no Sanity, então dá para reverter só reapontando.
 *
 *   node scripts/trocar-imagens-engates.mjs          # simulação
 *   node scripts/trocar-imagens-engates.mjs --yes    # aplica
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

const DIR = "engates-delcaflex-src";
const CATEGORIA = "Engates";

// arquivo → nome do produto no Sanity
const TROCAS = {
  "05-ert-a-adaptador-rosca-femea.png": "ERT-A Adaptador Rosca Fêmea",
  "06-ert-b-acoplador-rosca-macho.png": "ERT-B Acoplador Rosca Macho",
  "07-ert-c-acoplador-espigao.png": "ERT-C Acoplador Espigão",
  "08-ert-d-acoplador-rosca-femea.png": "ERT-D Acoplador Rosca Fêmea",
  "09-ert-e-adaptador-espigao.png": "ERT-E Adaptador Espigão",
  "10-ert-f-adaptador-rosca-macho.png": "ERT-F Adaptador Rosca Macho",
  "11-ert-dc-acoplador-tampa.png": "ERT-DC Acoplador Tampa",
  "12-ert-dp-adaptador-tampao.png": "ERT-DP Adaptador Tampão",
};

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const produtos = await client.fetch(
    `*[_type == "produto" && categoria->nome == $c]{ _id, nome, "assetId": imagem.asset._ref }`,
    { c: CATEGORIA });
  const porNome = new Map(produtos.map((p) => [p.nome, p]));

  // Valida tudo antes de subir qualquer byte.
  const plano = [], erros = [];
  for (const [arquivo, nome] of Object.entries(TROCAS)) {
    const caminho = resolve(__dirname, DIR, arquivo);
    if (!existsSync(caminho)) { erros.push(`arquivo não encontrado: ${DIR}/${arquivo}`); continue; }
    const produto = porNome.get(nome);
    if (!produto) { erros.push(`produto não encontrado no Sanity: "${nome}"`); continue; }
    plano.push({ arquivo, caminho, produto });
  }

  if (erros.length) {
    console.error("❌ Nada foi feito. Problemas:");
    for (const e of erros) console.error("   " + e);
    console.error(`\n   produtos existentes em "${CATEGORIA}":`);
    for (const p of produtos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")))
      console.error("     " + p.nome);
    process.exit(1);
  }

  console.log(`${plano.length} trocas (de ${produtos.length} produtos na categoria):\n`);
  for (const { arquivo, caminho, produto } of plano) {
    const kb = (readFileSync(caminho).length / 1024).toFixed(0);
    console.log(`  ${produto.nome}`);
    console.log(`     ${DIR}/${arquivo}  (${kb} KB)`);
  }

  const intocados = produtos.filter((p) => !plano.some((x) => x.produto._id === p._id));
  if (intocados.length) {
    console.log(`\n  ficam como estão (${intocados.length}):`);
    for (const p of intocados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")))
      console.log(`     ${p.nome}`);
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  // Sobe tudo primeiro, aponta depois numa transação só.
  const novos = [];
  for (const { arquivo, caminho, produto } of plano) {
    process.stdout.write(`  ⬆️  ${arquivo} ... `);
    const asset = await client.assets.upload("image", readFileSync(caminho), {
      filename: arquivo, contentType: "image/png",
    });
    console.log(asset._id.slice(0, 28) + "…");
    novos.push({ produto, assetId: asset._id });
  }

  let tx = client.transaction();
  for (const { produto, assetId } of novos)
    tx = tx.patch(produto._id, (p) =>
      p.set({ imagem: { _type: "image", asset: { _type: "reference", _ref: assetId } } }));
  await tx.commit();

  console.log(`\n✅ ${novos.length} imagens trocadas.`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
