/**
 * Produtos novos de latão vindos do Figma (nov/2026):
 *   nó 1018:558  "Adaptadores em latão"  → 24 no design, 9 no site, 15 novos
 *   nó  866:456  "Conexões em latão"     → 47 no design, 42 no site,  6 novos
 *
 * Também aplica as decisões do cliente (ver scripts/figma-extraido/DECISOES.md):
 *   - remove "1010 Tee Macho Central": não está no design novo nem na p.30 do catálogo
 *   - confere a imagem de "2103 União": no DESIGN ela dividia o asset com "2109
 *     Tee União", mas no Sanity as duas já têm imagens distintas e corretas. O
 *     arquivo do nó 915:994 bate byte a byte com o que já está lá, então o script
 *     só confirma. Se um dia divergir, ele troca.
 *
 * Os produtos entram sem descrição, como os 51 vizinhos — as duas categorias têm
 * 0/42 e 0/9 com descrição, e o design também só traz nome + imagem.
 *
 * O slug mantém o sufixo `-conexoes-adaptadores` dos vizinhos. É herança do nome
 * antigo da categoria, mas trocar agora deixaria 21 slugs fora do padrão dos 51
 * que já estão publicados.
 *
 * Idempotente: pula produto cujo slug já exista, e não refaz o que já foi aplicado.
 *
 *   node scripts/incluir-latao-novos.mjs          # simulação
 *   node scripts/incluir-latao-novos.mjs --yes    # aplica
 *
 * Requer em .env.local ou .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
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

// "6045 Cotovelo 45° Forjado" → { codigo: "6045", resto: "Cotovelo 45° Forjado" }
function parteNome(nome) {
  const m = nome.match(/^(\d{4}[A-Z]?)\s+(.*)$/);
  if (!m) throw new Error(`nome sem código no início: "${nome}"`);
  return { codigo: m[1], resto: m[2] };
}

const LOTES = [
  { arquivo: "adaptadores-latao-novos.json", dir: "adaptadores-latao-src", categoria: "Adaptadores em Latão" },
  { arquivo: "conexoes-latao-novos.json", dir: "conexoes-latao-src", categoria: "Conexões em Latão" },
];

const REMOVER = "1010 Tee Macho Central";
const TROCAR_IMAGEM = { nome: "2103 União", dir: "conexoes-latao-src", arquivo: "2103-uniao.png" };

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const plano = [], erros = [];

  // ---------- 1) produtos novos ----------
  for (const lote of LOTES) {
    const cat = await client.fetch(
      `*[_type=="categoria" && nome==$n][0]{_id, "subs": subcategorias[].nome}`, { n: lote.categoria });
    if (!cat) { erros.push(`categoria não encontrada: ${lote.categoria}`); continue; }

    const itens = JSON.parse(readFileSync(resolve(__dirname, "figma-extraido", lote.arquivo), "utf8"));
    for (const item of itens) {
      const caminho = resolve(__dirname, lote.dir, item.arquivo);
      if (!existsSync(caminho)) { erros.push(`imagem faltando: ${lote.dir}/${item.arquivo}`); continue; }

      // subcategoria tem de existir na categoria, senão o produto nasce órfão
      if (item.subcategoria && !(cat.subs ?? []).includes(item.subcategoria)) {
        erros.push(`subcategoria "${item.subcategoria}" não existe em "${lote.categoria}"`);
        continue;
      }

      const { codigo, resto } = parteNome(item.nome);
      plano.push({
        tipo: "criar", categoria: lote.categoria, categoriaId: cat._id, caminho,
        nome: item.nome, ordem: parseInt(codigo, 10), subcategoria: item.subcategoria ?? null,
        slug: slugify(`${resto}-${codigo}-conexoes-adaptadores`),
      });
    }
  }

  // slug duplicado entre os novos indicaria erro de extração
  const vistos = new Set();
  for (const p of plano) {
    if (vistos.has(p.slug)) erros.push(`slug repetido entre os novos: ${p.slug}`);
    vistos.add(p.slug);
  }

  // ---------- 2) remoção ----------
  const aRemover = await client.fetch(
    `*[_type=="produto" && nome==$n][0]{_id,nome,"slug":slug.current,ordem,subcategoria,
       "asset":imagem.asset._ref,"cat":categoria->nome}`, { n: REMOVER });

  // ---------- 3) troca de imagem ----------
  const aTrocar = await client.fetch(
    `*[_type=="produto" && nome==$n][0]{_id,nome,"asset":imagem.asset._ref}`, { n: TROCAR_IMAGEM.nome });
  const caminhoTroca = resolve(__dirname, TROCAR_IMAGEM.dir, TROCAR_IMAGEM.arquivo);
  if (!aTrocar) erros.push(`produto não encontrado para troca de imagem: "${TROCAR_IMAGEM.nome}"`);
  if (!existsSync(caminhoTroca)) erros.push(`imagem faltando: ${TROCAR_IMAGEM.dir}/${TROCAR_IMAGEM.arquivo}`);

  if (erros.length) {
    console.error("❌ Nada foi feito. Problemas:");
    for (const e of erros) console.error("   " + e);
    process.exit(1);
  }

  // já existe?
  const slugs = plano.map((p) => p.slug);
  const existentes = new Set(await client.fetch(
    `*[_type=="produto" && slug.current in $s].slug.current`, { s: slugs }));
  const criar = plano.filter((p) => !existentes.has(p.slug));
  const pulados = plano.filter((p) => existentes.has(p.slug));

  for (const lote of LOTES) {
    const meus = criar.filter((p) => p.categoria === lote.categoria);
    console.log(`=== ${lote.categoria}: ${meus.length} a criar ===`);
    for (const p of meus.sort((a, b) => a.ordem - b.ordem)) {
      const kb = (readFileSync(p.caminho).length / 1024).toFixed(0);
      console.log(`  ${String(p.ordem).padStart(5)}  ${p.nome}`);
      console.log(`         sub: ${p.subcategoria ?? "(nenhuma)"} | ${kb} KB | ${p.slug}`);
    }
    console.log("");
  }
  if (pulados.length) console.log(`(${pulados.length} já existiam, pulados)\n`);

  console.log(`=== Remover ===`);
  console.log(aRemover ? `  "${aRemover.nome}" (${aRemover._id}) de ${aRemover.cat} › ${aRemover.subcategoria}`
                       : `  "${REMOVER}" não existe mais — nada a fazer`);

  // O _id do asset no Sanity é image-<sha1>-<w>x<h>-<ext>. Comparando o sha1 do
  // arquivo local dá para saber se a imagem já é exatamente essa, sem subir nada.
  const sha = createHash("sha1").update(readFileSync(caminhoTroca)).digest("hex");
  const trocaNecessaria = !(aTrocar.asset || "").includes(sha);
  console.log("");
  console.log("=== Imagem do 2103 União ===");
  if (trocaNecessaria) {
    console.log(`  atual : ${aTrocar.asset}`);
    console.log(`  nova  : ${TROCAR_IMAGEM.dir}/${TROCAR_IMAGEM.arquivo}`);
  } else {
    console.log("  já está correta — o arquivo do nó 915:994 bate com o asset atual.");
    console.log(`  sha1 ${sha.slice(0, 12)}… — nada a subir`);
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  // Backup do que vai sumir, antes de qualquer escrita.
  if (aRemover) {
    const bk = resolve(__dirname, "figma-extraido", "removido-1010.json");
    writeFileSync(bk, JSON.stringify(aRemover, null, 1), "utf8");
    console.log(`\n💾 backup do removido em scripts/figma-extraido/removido-1010.json`);
  }

  // Sobe todas as imagens antes de tocar nos documentos.
  const comAsset = [];
  for (const p of criar) {
    process.stdout.write(`  ⬆️  ${p.nome} ... `);
    const asset = await client.assets.upload("image", readFileSync(p.caminho), {
      filename: p.caminho.split(/[\\/]/).pop(), contentType: "image/png",
    });
    console.log(asset._id.slice(0, 26) + "…");
    comAsset.push({ ...p, assetId: asset._id });
  }
  let assetTroca = null;
  if (trocaNecessaria) {
    process.stdout.write(`  ⬆️  ${TROCAR_IMAGEM.arquivo} ... `);
    assetTroca = await client.assets.upload("image", readFileSync(caminhoTroca), {
      filename: TROCAR_IMAGEM.arquivo, contentType: "image/png",
    });
    console.log(assetTroca._id.slice(0, 26) + "…");
  }

  let tx = client.transaction();
  for (const p of comAsset)
    tx = tx.create({
      _type: "produto", nome: p.nome,
      slug: { _type: "slug", current: p.slug },
      ordem: p.ordem,
      ...(p.subcategoria ? { subcategoria: p.subcategoria } : {}),
      imagem: { _type: "image", asset: { _type: "reference", _ref: p.assetId } },
      categoria: { _type: "reference", _ref: p.categoriaId },
    });
  if (assetTroca)
    tx = tx.patch(aTrocar._id, (p) =>
      p.set({ imagem: { _type: "image", asset: { _type: "reference", _ref: assetTroca._id } } }));
  if (aRemover) tx = tx.delete(aRemover._id);
  await tx.commit();

  console.log(`\n✅ ${comAsset.length} criados, ${assetTroca ? 1 : 0} imagem trocada, ${aRemover ? 1 : 0} removido.`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
