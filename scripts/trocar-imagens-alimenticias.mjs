/**
 * Ajustes.xlsx, aba "Geral":
 *   "Remover Marca supreflex das mangueiras alimentícias"
 *
 * As imagens já tratadas (marca removida) estão em scripts/alimenticias-limpas/.
 * São 7 das 12 da categoria — só esses itens tinham a marca aparente. Os nomes
 * de arquivo são os mesmos de scripts/alimenticias-src/, então o mapeamento
 * arquivo → produto é o do seed original.
 *
 * O que faz: sobe cada PNG como asset novo e aponta o produto para ele.
 * Não mexe em nome, descrição, categoria nem subcategoria. O asset antigo não
 * é apagado — fica órfão no Sanity, e limpar isso é outro assunto (dá para
 * reverter só reapontando, enquanto o antigo existir).
 *
 * Simulação por padrão. Use --yes para aplicar.
 *
 *   node scripts/trocar-imagens-alimenticias.mjs
 *   node scripts/trocar-imagens-alimenticias.mjs --yes
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

const DIR = "alimenticias-limpas";
const CATEGORIA = "Mangueiras Alimentícias e sanitárias";

// arquivo → nome do produto no Sanity (mesmo mapeamento de seed-alimenticias-tubos.mjs)
const TROCAS = {
  "03-mangueira-atoxica-pressao.png": "Mangueira de Borracha Atóxica Pressão",
  "04-ponteira-inox-din.png": "Ponteira INOX DIN",
  "05-ponteira-inox-rjt.png": "Ponteira INOX RJT Fêmea e Macho",
  "06-ponteira-inox-sms.png": "Ponteira INOX SMS Fêmea e Macho",
  "07-ponteira-inox-bsp.png": "Ponteira INOX BSP Roscada",
  "08-engate-inox-tc.png": "Engate INOX TC",
  "09-engate-rapido-inox-macho.png": "Engate Rápido INOX Macho",
};

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const produtos = await client.fetch(
    `*[_type == "produto" && categoria->nome == $c]{
       _id, nome, "assetId": imagem.asset._ref
     }`, { c: CATEGORIA });

  const porNome = new Map(produtos.map((p) => [p.nome, p]));

  // Valida tudo antes de subir qualquer byte: arquivo existe e produto existe.
  const plano = [];
  const erros = [];
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
    for (const p of produtos.sort((a,b)=>a.nome.localeCompare(b.nome,"pt-BR"))) console.error("     " + p.nome);
    process.exit(1);
  }

  console.log(`${plano.length} trocas (de ${produtos.length} produtos na categoria):\n`);
  for (const { arquivo, produto } of plano) {
    const kb = (readFileSync(resolve(__dirname, DIR, arquivo)).length / 1024).toFixed(0);
    console.log(`  ${produto.nome}`);
    console.log(`     arquivo : ${DIR}/${arquivo}  (${kb} KB)`);
    console.log(`     asset    : ${produto.assetId ?? "(sem imagem)"} → novo`);
  }

  const intocados = produtos.filter((p) => !plano.some((x) => x.produto._id === p._id));
  if (intocados.length) {
    console.log(`\n  ficam como estão (${intocados.length}):`);
    for (const p of intocados.sort((a,b)=>a.nome.localeCompare(b.nome,"pt-BR"))) console.log(`     ${p.nome}`);
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  // Sobe tudo primeiro; só depois aponta os produtos, numa transação só — assim
  // uma falha no meio do upload não deixa metade dos produtos trocados.
  const novos = [];
  for (const { arquivo, caminho, produto } of plano) {
    process.stdout.write(`  ⬆️  ${arquivo} ... `);
    const asset = await client.assets.upload("image", readFileSync(caminho), {
      filename: arquivo, contentType: "image/png",
    });
    console.log(asset._id);
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
