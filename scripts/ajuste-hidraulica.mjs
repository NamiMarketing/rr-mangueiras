/**
 * Ajustes.xlsx, aba "linha hidraulica" — dois itens que são só site, sem
 * dependência do catálogo:
 *
 *   1. "TERMINAL GIRATORIO FEMEA e MACHO FIXO BSP (GIRAR uma das fotos)"
 *      "TERMINAL FIXO MACHO METRICO SÉRIES LEVE E PESADA (GIRAR A FOTO)"
 *
 *      As duas estão de cabeça para baixo em relação às irmãs: no padrão da
 *      categoria (ver NPTF, JIC 37, ORFS) a rosca fica em cima e o espigão
 *      canelado embaixo. Nessas duas é o contrário, então giram 180°.
 *      No BSP a imagem traz as duas peças juntas, e ambas estão invertidas —
 *      girar a imagem inteira acerta as duas e mantém elas coerentes entre si.
 *
 *   2. Nome dos 3 manômetros: passa a ser exatamente o da planilha (aba
 *      "linha hidraulica", linhas 24 a 26), inclusive o "Com" maiúsculo e o
 *      "100 mm" com espaço só no Total Inox. O campo `descricao` deles é null;
 *      o texto que aparece na listagem é o `nome`.
 *
 * A foto girada é gravada em scripts/linha-hidraulica-src/ antes de subir, para
 * ficar auditável. O asset antigo continua no Sanity, então dá para reverter.
 * O slug não é tocado: é a URL de /produtos/[slug].
 *
 *   node scripts/ajuste-hidraulica.mjs          # simulação
 *   node scripts/ajuste-hidraulica.mjs --yes    # aplica
 *
 * Requer em .env.local ou .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { decodePNG, encodePNG, girar180 } from "./lib/png.mjs";

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

const DIR_SAIDA = "linha-hidraulica-src";

const GIRAR = [
  { nome: "Terminal Giratório Fêmea e Macho Fixo BSP", arquivo: "terminal-bsp-girado.png" },
  { nome: "Terminal Fixo Macho Metrico Séries Leve e Pesada", arquivo: "terminal-metrico-girado.png" },
];

// Nome atual no Sanity → nome exato da planilha. Reproduz o documento como
// está, inclusive o "Com" maiúsculo e o "100 mm" com espaço apenas no Total Inox.
const MANOMETROS = [
  ["Manômetro 63mm Caixa em Inox com Glicerina", "Manômetro 63mm Caixa em Inox Com Glicerina"],
  ["Manômetro 100mm Caixa Inox com Glicerina", "Manômetro 100mm Caixa em Inox Com Glicerina"],
  ["Manômetro 100mm Total Inox com Glicerina", "Manômetro 100 mm Total Inox Com Glicerina"],
];

function urlDoAsset(ref) {
  // image-<hash>-<w>x<h>-<ext>  →  https://cdn.sanity.io/images/<proj>/<ds>/<hash>-<w>x<h>.<ext>
  const m = ref.match(/^image-([0-9a-f]+)-(\d+x\d+)-(\w+)$/);
  if (!m) throw new Error(`ref de asset inesperada: ${ref}`);
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
}

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  // ---------- 1) fotos a girar ----------
  console.log("=== 1) Girar 180° ===");
  const giros = [];
  for (const alvo of GIRAR) {
    const docs = await client.fetch(
      `*[_type=="produto" && nome==$n]{_id,nome,"asset":imagem.asset._ref}`, { n: alvo.nome });
    if (docs.length !== 1) {
      console.error(`❌ esperava 1 produto "${alvo.nome}", achei ${docs.length}`);
      process.exit(1);
    }
    const doc = docs[0];
    const url = urlDoAsset(doc.asset);
    const resp = await fetch(url);
    if (!resp.ok) { console.error(`❌ não baixou ${url}: ${resp.status}`); process.exit(1); }
    const original = decodePNG(Buffer.from(await resp.arrayBuffer()));

    // Girar de novo desfaria o trabalho. Se o asset que está no ar já é pixel
    // a pixel igual ao arquivo girado que gravamos antes, não há o que fazer.
    const caminhoSalvo = resolve(__dirname, DIR_SAIDA, alvo.arquivo);
    if (existsSync(caminhoSalvo)) {
      const salvo = decodePNG(readFileSync(caminhoSalvo));
      if (salvo.w === original.w && salvo.h === original.h &&
          Buffer.compare(salvo.px, original.px) === 0) {
        console.log(`  ${doc.nome}`);
        console.log("     já está girada — pulando");
        continue;
      }
    }

    const girado = girar180(original);
    const buf = encodePNG(girado);

    // sanidade: girar de novo tem que devolver o original
    if (Buffer.compare(girar180(girado).px, original.px) !== 0) {
      console.error(`❌ giro não é reversível em "${doc.nome}" — abortando`);
      process.exit(1);
    }

    writeFileSync(caminhoSalvo, buf);
    console.log(`  ${doc.nome}`);
    console.log(`     ${original.w}x${original.h} → girada, ${(buf.length / 1024).toFixed(0)} KB`);
    console.log(`     salva em scripts/${DIR_SAIDA}/${alvo.arquivo}`);
    giros.push({ doc, buf, arquivo: alvo.arquivo });
  }

  // ---------- 2) nomes dos manômetros ----------
  console.log("");
  console.log("=== 2) Nome dos manômetros — igual à planilha ===");
  const renomeios = [];
  for (const [atual, alvo] of MANOMETROS) {
    // aceita o nome antigo ou o já corrigido, para poder rodar de novo
    const docs = await client.fetch(
      `*[_type=="produto" && nome in [$a,$b]]{_id,nome}`, { a: atual, b: alvo });
    if (docs.length !== 1) {
      console.error(`❌ esperava 1 produto "${atual}" (ou já "${alvo}"), achei ${docs.length}`);
      process.exit(1);
    }
    const doc = docs[0];
    if (doc.nome === alvo) { console.log(`  (já certo) ${alvo}`); continue; }
    console.log(`  ${doc.nome}`);
    console.log(`     → ${alvo}`);
    renomeios.push({ _id: doc._id, nomeNovo: alvo });
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado no Sanity. Rode com --yes para aplicar.");
    console.log("(as fotos giradas já ficaram em disco para conferência)");
    return;
  }

  const novos = [];
  for (const { doc, buf, arquivo } of giros) {
    process.stdout.write(`  ⬆️  ${arquivo} ... `);
    const asset = await client.assets.upload("image", buf, {
      filename: arquivo, contentType: "image/png",
    });
    console.log(asset._id.slice(0, 28) + "…");
    novos.push({ doc, assetId: asset._id });
  }

  let tx = client.transaction();
  for (const { doc, assetId } of novos)
    tx = tx.patch(doc._id, (p) =>
      p.set({ imagem: { _type: "image", asset: { _type: "reference", _ref: assetId } } }));
  for (const r of renomeios) tx = tx.patch(r._id, (p) => p.set({ nome: r.nomeNovo }));
  await tx.commit();

  console.log(`\n✅ ${novos.length} fotos giradas, ${renomeios.length} nomes corrigidos.`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
