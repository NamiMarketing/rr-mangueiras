/**
 * Ajustes.xlsx, aba "pneumatica":
 *   "Mover todos os códigos para o início da frase - Ordenar por código"
 *
 * Hoje os nomes estão como "Anilha 1001"; devem ficar "1001 Anilha".
 * E o campo `ordem` passa a receber o próprio código, para a listagem sair
 * ordenada por código dentro de cada subcategoria.
 *
 * NÃO mexe no slug de propósito: o slug é a URL de /produtos/[slug] e mudá-lo
 * quebraria links já publicados. Nome e slug ficam divergentes, o que é normal.
 *
 * Roda em modo simulação por padrão — mostra o que mudaria e não grava nada.
 * Use --yes para aplicar de verdade.
 *
 *   node scripts/ajuste-codigo-no-inicio.mjs          # simulação
 *   node scripts/ajuste-codigo-no-inicio.mjs --yes    # aplica
 *
 * Requer em .env.local ou .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
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
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Só estas duas categorias — é o universo latão + pneumático da planilha.
const CATEGORIAS = ["Linha Pneumática", "Conexões e adaptadores"];

// Código no fim do nome: 4 dígitos com sufixo opcional de uma letra
// (8504P, 8545G, 6003A). Exige 4 dígitos para não pegar "Tubos PA12",
// "Tubos PA6" nem "Adaptador 90° Flange 6000 PSI" (que não termina em código).
const CODIGO_NO_FIM = /^(.*?)\s+(\d{4}[A-Z]?)$/;

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const produtos = await client.fetch(
    `*[_type == "produto" && categoria->nome in $cats]{
       _id, nome, ordem, subcategoria, "cat": categoria->nome
     }`,
    { cats: CATEGORIAS }
  );

  const mudancas = [];
  const semCodigo = [];

  for (const p of produtos) {
    const m = p.nome.match(CODIGO_NO_FIM);
    if (!m) {
      semCodigo.push(p);
      continue;
    }
    const [, resto, codigo] = m;
    const nomeNovo = `${codigo} ${resto}`.replace(/\s+/g, " ").trim();
    const ordemNova = parseInt(codigo, 10);
    if (p.nome === nomeNovo && p.ordem === ordemNova) continue;
    mudancas.push({ ...p, nomeNovo, ordemNova });
  }

  // Colisão de nome dentro da mesma categoria indicaria duplicata real.
  const vistos = new Map();
  for (const m of mudancas) {
    const chave = `${m.cat}||${m.nomeNovo}`;
    if (vistos.has(chave)) {
      console.error(`❌ COLISÃO: "${m.nomeNovo}" em ${m.cat} apareceria duas vezes`);
      process.exit(1);
    }
    vistos.set(chave, m._id);
  }

  for (const cat of CATEGORIAS) {
    const doCat = mudancas.filter((m) => m.cat === cat);
    console.log(`\n=== ${cat} — ${doCat.length} renomeações ===`);
    for (const m of doCat.sort((a, b) => a.ordemNova - b.ordemNova)) {
      console.log(`  ${String(m.ordemNova).padStart(5)}  ${m.nome}`);
      console.log(`         →  ${m.nomeNovo}`);
    }
  }

  if (semCodigo.length) {
    console.log(`\n=== sem código no fim — ficam intactos (${semCodigo.length}) ===`);
    for (const p of semCodigo.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")))
      console.log(`  ${p.nome}   [${p.cat}]`);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`total a renomear: ${mudancas.length} | intactos: ${semCodigo.length}`);

  if (!APLICAR) {
    console.log("Nada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  let tx = client.transaction();
  for (const m of mudancas) tx = tx.patch(m._id, (p) => p.set({ nome: m.nomeNovo, ordem: m.ordemNova }));
  await tx.commit();
  console.log(`✅ ${mudancas.length} produtos atualizados.`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
