/**
 * Ajustes.xlsx, aba "pneumatica":
 *   "Válvulas: ... (TROCAR FOTO)"
 *   "Manômetros: ... / TROCAR FOTO - foto ao lado - tirar fundo"
 *
 * Faz duas coisas nos produtos "Válvulas" e "Manômetros" da Linha Pneumática:
 *   1. troca a imagem pelas novas de scripts/linha-pneumatica-src/
 *   2. prefixa a descrição com o nome ("Válvulas: ", "Manômetros: ")
 *
 * A descrição nova é DERIVADA da que já está no Sanity — só acrescenta o
 * prefixo e, no caso do manômetro, baixa a inicial ("Utilizados" → "utilizados").
 * Assim o texto longo das normas DIN não é redigitado, e não há risco de
 * introduzir erro de transcrição num trecho que já estava certo.
 *
 * Idempotente: se a descrição já começa com o prefixo, não mexe nela.
 *
 *   node scripts/ajuste-valvulas-manometros.mjs          # simulação
 *   node scripts/ajuste-valvulas-manometros.mjs --yes    # aplica
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

const DIR = "linha-pneumatica-src";

const ALVOS = [
  {
    nome: "Válvulas",
    arquivo: "valvulas.png",
    prefixo: "Válvulas: ",
    // "Controlam..." continua com maiúscula depois do prefixo
    baixarInicial: false,
  },
  {
    nome: "Manômetros",
    arquivo: "manometro.png",
    prefixo: "Manômetros: ",
    // "Utilizados..." vira "utilizados..." depois do prefixo
    baixarInicial: true,
  },
];

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const plano = [];
  const erros = [];

  for (const alvo of ALVOS) {
    const caminho = resolve(__dirname, DIR, alvo.arquivo);
    if (!existsSync(caminho)) { erros.push(`arquivo não encontrado: ${DIR}/${alvo.arquivo}`); continue; }

    const docs = await client.fetch(
      `*[_type=="produto" && nome==$n]{_id,nome,descricao,"cat":categoria->nome,"asset":imagem.asset._ref}`,
      { n: alvo.nome });
    if (docs.length !== 1) {
      erros.push(`esperava 1 produto chamado "${alvo.nome}", achei ${docs.length}`);
      continue;
    }
    const doc = docs[0];
    if (!doc.descricao) { erros.push(`"${alvo.nome}" está sem descrição — nada para prefixar`); continue; }

    let descricaoNova;
    if (doc.descricao.startsWith(alvo.prefixo)) {
      descricaoNova = doc.descricao;           // já prefixada
    } else {
      const corpo = alvo.baixarInicial
        ? doc.descricao[0].toLowerCase() + doc.descricao.slice(1)
        : doc.descricao;
      descricaoNova = alvo.prefixo + corpo;
    }
    plano.push({ alvo, doc, caminho, descricaoNova });
  }

  if (erros.length) {
    console.error("❌ Nada foi feito. Problemas:");
    for (const e of erros) console.error("   " + e);
    process.exit(1);
  }

  for (const { alvo, doc, caminho, descricaoNova } of plano) {
    const kb = (readFileSync(caminho).length / 1024).toFixed(0);
    console.log(`\n=== ${doc.nome}  (${doc.cat}) ===`);
    console.log(`  imagem : ${doc.asset}`);
    console.log(`         → ${DIR}/${alvo.arquivo}  (${kb} KB)`);
    if (descricaoNova === doc.descricao) {
      console.log(`  texto  : já prefixado, sem mudança`);
    } else {
      console.log(`  antes  : ${doc.descricao}`);
      console.log(`  depois : ${descricaoNova}`);
    }
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  // Sobe as duas imagens antes de tocar nos documentos, para não deixar
  // metade aplicada se um upload falhar.
  const novos = [];
  for (const { alvo, doc, caminho, descricaoNova } of plano) {
    process.stdout.write(`  ⬆️  ${alvo.arquivo} ... `);
    const asset = await client.assets.upload("image", readFileSync(caminho), {
      filename: alvo.arquivo, contentType: "image/png",
    });
    console.log(asset._id);
    novos.push({ doc, assetId: asset._id, descricaoNova });
  }

  let tx = client.transaction();
  for (const { doc, assetId, descricaoNova } of novos)
    tx = tx.patch(doc._id, (p) => p.set({
      descricao: descricaoNova,
      imagem: { _type: "image", asset: { _type: "reference", _ref: assetId } },
    }));
  await tx.commit();

  console.log(`\n✅ ${novos.length} produtos atualizados (imagem + descrição).`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
