/**
 * Categoria "Mangueiras" — Figma 909:690. A categoria já existia no Sanity,
 * vazia; este script cadastra as 5 subcategorias e os 46 produtos.
 *
 * Decisões do cliente aplicadas (scripts/figma-extraido/DECISOES.md):
 *   - a 2ª seção "MANGUEIRAS DE PVC" do design está errada; o nome certo é
 *     "Mangueiras Atóxicas". Sem isso ela cairia no mesmo grupo da primeira,
 *     já que `produto.subcategoria` é string casada por igualdade exata.
 *
 * Dois pontos que valem o comentário:
 *   - as 17 mangueiras hidráulicas (R1..4SH) NÃO têm imagem no design: são só
 *     nome + descrição. O campo `imagem` deixou de ser obrigatório no schema e
 *     a listagem fecha a coluna quando nenhum item do grupo tem imagem.
 *   - `ordem` é a posição vertical no design, não o nome. Alfabético colocaria
 *     R12 logo depois de R1; o design vai R1, R2, R3... R17, 4SP, 4SH.
 *
 * Idempotente: pula produto cujo slug já exista.
 *
 *   node scripts/seed-mangueiras.mjs          # simulação
 *   node scripts/seed-mangueiras.mjs --yes    # aplica
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

const slugify = (t) => t.toString().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const CATEGORIA = "Mangueiras";
const DIR = "mangueiras-src";
const DADOS = "figma-extraido/mangueiras-final.json";

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const d = JSON.parse(readFileSync(resolve(__dirname, DADOS), "utf8"));
  const cat = await client.fetch(
    `*[_type=="categoria" && nome==$n][0]{_id, "subs": subcategorias[].nome,
      "n": count(*[_type=="produto" && references(^._id)])}`, { n: CATEGORIA });
  if (!cat) { console.error(`❌ categoria "${CATEGORIA}" não existe`); process.exit(1); }

  // ---------- validação antes de qualquer escrita ----------
  const erros = [];
  for (const p of d.produtos) {
    if (!p.subcategoria) erros.push(`sem subcategoria: ${p.nome}`);
    if (!d.subcategorias.includes(p.subcategoria)) erros.push(`subcategoria fora da lista: ${p.subcategoria}`);
    if (!p.descricao) erros.push(`sem descrição: ${p.nome}`);
    if (p.arquivo && !existsSync(resolve(__dirname, DIR, p.arquivo)))
      erros.push(`imagem faltando: ${DIR}/${p.arquivo}`);
  }
  const slugs = d.produtos.map((p) => slugify(`${p.nome}-mangueiras`));
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dup.length) erros.push(`slug repetido: ${[...new Set(dup)].join(", ")}`);
  if (erros.length) {
    console.error("❌ Nada foi feito. Problemas:");
    for (const e of [...new Set(erros)]) console.error("   " + e);
    process.exit(1);
  }

  const existentes = new Set(await client.fetch(
    `*[_type=="produto" && slug.current in $s].slug.current`, { s: slugs }));

  const subcategorias = d.subcategorias.map((nome, i) => ({
    _type: "object", _key: slugify(nome), nome, ordem: i + 1,
  }));

  console.log(`Categoria "${CATEGORIA}" tem ${cat.n} produtos hoje.`);
  console.log(`Subcategorias a gravar (${subcategorias.length}):`);
  for (const s of subcategorias) {
    const n = d.produtos.filter((p) => p.subcategoria === s.nome);
    const semImg = n.filter((p) => !p.arquivo).length;
    console.log(`  ${s.ordem}. ${s.nome.padEnd(24)} ${String(n.length).padStart(2)} itens` +
                (semImg ? `  (${semImg} sem imagem, por design)` : ""));
  }

  const criar = d.produtos.filter((p, i) => !existentes.has(slugs[i]));
  console.log(`\nProdutos: ${criar.length} a criar, ${d.produtos.length - criar.length} já existiam.`);
  for (const s of d.subcategorias) {
    const meus = criar.filter((p) => p.subcategoria === s);
    if (!meus.length) continue;
    console.log(`\n  [${s}]`);
    for (const p of meus) console.log(`    ${String(p.ordem).padStart(2)}  ${p.nome}${p.arquivo ? "" : "   (sem imagem)"}`);
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  // Sobe as imagens primeiro; depois grava tudo numa transação só.
  const assets = new Map();
  for (const p of criar) {
    if (!p.arquivo) continue;
    process.stdout.write(`  ⬆️  ${p.arquivo} ... `);
    const asset = await client.assets.upload("image", readFileSync(resolve(__dirname, DIR, p.arquivo)), {
      filename: p.arquivo, contentType: "image/png",
    });
    console.log(asset._id.slice(0, 24) + "…");
    assets.set(p.nome, asset._id);
  }

  let tx = client.transaction();
  tx = tx.patch(cat._id, (x) => x.set({ subcategorias }));
  for (const p of criar) {
    const assetId = assets.get(p.nome);
    tx = tx.create({
      _type: "produto",
      nome: p.nome,
      slug: { _type: "slug", current: slugify(`${p.nome}-mangueiras`) },
      descricao: p.descricao,
      subcategoria: p.subcategoria,
      ordem: p.ordem,
      ...(assetId ? { imagem: { _type: "image", asset: { _type: "reference", _ref: assetId } } } : {}),
      categoria: { _type: "reference", _ref: cat._id },
    });
  }
  await tx.commit();

  console.log(`\n✅ ${criar.length} produtos criados, ${subcategorias.length} subcategorias gravadas.`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
