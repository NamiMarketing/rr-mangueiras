/**
 * Ajustes.xlsx — aba "pneumatica" + anotações em vermelho das páginas 17, 30 e
 * 31 do catálogo (abas "Conexões em Latão" e "Adaptadores em Latão").
 *
 * O que faz:
 *   1. "Conexões e adaptadores" passa a se chamar "Conexões em Latão"
 *      (ela já só continha latão; slug acompanha — nada no código aponta pra ele).
 *   2. Tira o prefixo "Conexões latão - " das 4 subcategorias dela, conforme
 *      as anotações em vermelho. Como `produto.subcategoria` é uma string solta
 *      casada por igualdade exata, cada produto é atualizado junto — senão os
 *      itens ficariam órfãos, fora de qualquer grupo.
 *   3. Move da "Linha Pneumática" para "Conexões em Latão" as 3 subcategorias
 *      marcadas com pai="Conexões de latão" (Tubos Plásticos 4xxx, Freio a Ar
 *      21xx e 26xx) — 24 produtos.
 *   4. Na pneumática, o pai "Conexões plásticas" vira "Conexões Pneumáticas".
 *      A CATEGORIA continua "Linha Pneumática", porque ela também guarda
 *      mangueiras, tubos, manômetros e válvulas, que não são conexões.
 *   5. Os silenciadores 8554/8555/8556 saem de "Torneiras e Drenos" (a página 17
 *      não os traz) e vão para a pneumática, numa subcategoria "Silenciadores" —
 *      é onde a planilha os lista.
 *
 * As subcategorias de "Conexões em Latão" ficam ordenadas por faixa de código
 * (1xxx, 2xxx, 26xx, 4xxx, 6xxx, 7xxx, 9xxx), casando com "ordenar por código".
 *
 * Simulação por padrão. Use --yes para aplicar.
 *
 *   node scripts/ajuste-latao-pneumatica.mjs
 *   node scripts/ajuste-latao-pneumatica.mjs --yes
 */

import { createClient } from "@sanity/client";
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

const CAT_LATAO_ANTIGA = "Conexões e adaptadores";
const CAT_LATAO = "Conexões em Latão";
const CAT_PNEU = "Linha Pneumática";

const RENOMEAR_SUB = {
  "Conexões latão - compressão": "Compressão",
  "Conexões latão - bicos para mangueira": "Bicos para Mangueira",
  "Conexões latão - drenos, silenciadores e torneiras": "Torneiras e Drenos",
  "Conexões latão - adaptadores": "Adaptadores em Latão",
};

const MOVER_PARA_LATAO = [
  "Conexões para Tubos Plásticos",
  "Freio a Ar (Milímetro)",
  "Freio a Ar (engate rápido)",
];

const SILENCIADORES = ["8554", "8555", "8556"];
const SUB_SILENCIADORES = "Silenciadores";
const PAI_PNEU_NOVO = "Conexões Pneumáticas";
const PAI_PNEU_ANTIGO = "Conexões plásticas";

// Ordem final das subcategorias de "Conexões em Latão", por faixa de código.
const ORDEM_LATAO = [
  "Compressão", "Freio a Ar (Milímetro)", "Freio a Ar (engate rápido)",
  "Conexões para Tubos Plásticos", "Adaptadores em Latão",
  "Bicos para Mangueira", "Torneiras e Drenos",
];

const sub = (nome, ordem, pai) => ({
  _type: "object", _key: slugify(nome), nome, ordem, ...(pai ? { pai } : {}),
});

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const catLatao = await client.fetch(
    `*[_type=="categoria" && nome in [$a,$b]][0]{_id,nome,subcategorias}`,
    { a: CAT_LATAO_ANTIGA, b: CAT_LATAO });
  const catPneu = await client.fetch(
    `*[_type=="categoria" && nome==$n][0]{_id,nome,subcategorias}`, { n: CAT_PNEU });
  if (!catLatao || !catPneu) throw new Error("categoria não encontrada");

  const produtos = await client.fetch(
    `*[_type=="produto" && categoria._ref in [$a,$b]]{_id,nome,subcategoria,"cat":categoria->nome}`,
    { a: catLatao._id, b: catPneu._id });

  const ops = { renomeiaProduto: [], moveParaLatao: [], moveParaPneu: [] };

  for (const p of produtos) {
    const novoNomeSub = RENOMEAR_SUB[p.subcategoria];
    const ehSilenciador = SILENCIADORES.some((c) => p.nome.startsWith(c + " "));

    if (ehSilenciador) {
      ops.moveParaPneu.push({ ...p, subNova: SUB_SILENCIADORES });
    } else if (MOVER_PARA_LATAO.includes(p.subcategoria)) {
      ops.moveParaLatao.push(p);
    } else if (novoNomeSub) {
      ops.renomeiaProduto.push({ ...p, subNova: novoNomeSub });
    }
  }

  console.log(`1) Categoria: "${catLatao.nome}" → "${CAT_LATAO}" (slug: ${slugify(CAT_LATAO)})`);
  console.log(`\n2) Subcategorias renomeadas (${Object.keys(RENOMEAR_SUB).length}):`);
  for (const [de, para] of Object.entries(RENOMEAR_SUB)) console.log(`     "${de}"\n       → "${para}"`);
  console.log(`   produtos com subcategoria reescrita: ${ops.renomeiaProduto.length}`);

  console.log(`\n3) Movidos p/ "${CAT_LATAO}": ${ops.moveParaLatao.length} produtos`);
  for (const s of MOVER_PARA_LATAO)
    console.log(`     [${s}] ${ops.moveParaLatao.filter((p) => p.subcategoria === s).length}`);

  console.log(`\n4) Pneumática: pai "${PAI_PNEU_ANTIGO}" → "${PAI_PNEU_NOVO}" (categoria segue "${CAT_PNEU}")`);

  console.log(`\n5) Movidos p/ "${CAT_PNEU}" em [${SUB_SILENCIADORES}]: ${ops.moveParaPneu.length}`);
  for (const p of ops.moveParaPneu) console.log(`     ${p.nome}`);

  // --- monta os arrays de subcategorias finais ---
  const subsPneuFinal = (catPneu.subcategorias ?? [])
    .filter((s) => !MOVER_PARA_LATAO.includes(s.nome))
    .map((s) => sub(s.nome, s.ordem, s.pai === PAI_PNEU_ANTIGO ? PAI_PNEU_NOVO : s.pai))
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  // Silenciadores tem que ficar COLADO nas outras do mesmo pai: a página só
  // imprime o título do pai quando ele muda em relação ao grupo anterior
  // (ProdutosClient.tsx:276), então subcategorias do mesmo pai separadas
  // fariam o título "Conexões Pneumáticas" aparecer duas vezes.
  const ultimoDoPai = subsPneuFinal.map((s) => s.pai === PAI_PNEU_NOVO).lastIndexOf(true);
  subsPneuFinal.splice(ultimoDoPai + 1, 0, sub(SUB_SILENCIADORES, 0, PAI_PNEU_NOVO));
  subsPneuFinal.forEach((s, i) => { s.ordem = i + 1; });

  const subsLataoFinal = ORDEM_LATAO.map((nome, i) => sub(nome, i + 1));

  console.log(`\n--- "${CAT_LATAO}" ficará com ${subsLataoFinal.length} subcategorias ---`);
  for (const s of subsLataoFinal) console.log(`   ${s.ordem}. ${s.nome}`);
  console.log(`\n--- "${CAT_PNEU}" ficará com ${subsPneuFinal.length} subcategorias ---`);
  for (const s of subsPneuFinal) console.log(`   ${s.ordem}. ${s.nome}${s.pai ? `   (pai: ${s.pai})` : ""}`);

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  let tx = client.transaction();
  tx = tx.patch(catLatao._id, (p) => p.set({
    nome: CAT_LATAO,
    slug: { _type: "slug", current: slugify(CAT_LATAO) },
    subcategorias: subsLataoFinal,
  }));
  tx = tx.patch(catPneu._id, (p) => p.set({ subcategorias: subsPneuFinal }));

  for (const p of ops.renomeiaProduto) tx = tx.patch(p._id, (x) => x.set({ subcategoria: p.subNova }));
  for (const p of ops.moveParaLatao)
    tx = tx.patch(p._id, (x) => x.set({ categoria: { _type: "reference", _ref: catLatao._id } }));
  for (const p of ops.moveParaPneu)
    tx = tx.patch(p._id, (x) => x.set({
      categoria: { _type: "reference", _ref: catPneu._id }, subcategoria: p.subNova }));

  await tx.commit();
  console.log(`\n✅ aplicado: categoria renomeada, ${ops.renomeiaProduto.length} subcategorias reescritas, ` +
              `${ops.moveParaLatao.length} movidos p/ latão, ${ops.moveParaPneu.length} p/ pneumática.`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
