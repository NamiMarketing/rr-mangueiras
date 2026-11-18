/**
 * "Conexões em Latão" tinha sido cadastrada com layout "compacto", que é o
 * arranjo de Válvulas industriais: as subcategorias correm lado a lado, em duas
 * colunas de grupos.
 *
 * O design correto (Figma 866:456) é o mesmo da Linha Hidráulica: cada
 * subcategoria ocupa a largura toda, uma embaixo da outra, e são os ITENS que
 * correm em duas colunas dentro de cada uma.
 *
 * Quem liga o lado a lado é `gruposLadoALado`, em ProdutosClient.tsx, e ele só
 * é verdadeiro quando `categoria.layout === "compacto"`. Com "auto" a categoria
 * decide por grupo: como nenhum dos 47 itens tem descrição, cada grupo cai no
 * layout compacto de linha (nome + imagem, itens em duas colunas) — que é
 * exatamente o do design.
 *
 *   node scripts/corrigir-layout-conexoes-latao.mjs          # simulação
 *   node scripts/corrigir-layout-conexoes-latao.mjs --yes    # aplica
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
  projectId: PROJECT_ID, dataset: DATASET, token: TOKEN,
  apiVersion: "2024-01-01", useCdn: false,
});

const CATEGORIA = "Conexões em Latão";
const LAYOUT_NOVO = "auto";

async function main() {
  console.log(`📦 ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔎 SIMULAÇÃO (use --yes para aplicar)\n");

  const cat = await client.fetch(
    `*[_type=="categoria" && nome==$n][0]{_id,nome,layout}`, { n: CATEGORIA });
  if (!cat) { console.error(`❌ categoria "${CATEGORIA}" não encontrada`); process.exit(1); }

  // Referência: as categorias que já usam o arranjo certo.
  const refs = await client.fetch(
    `*[_type=="categoria" && nome in ["Linha Hidráulica","Adaptadores em Latão"]]{nome,layout}`);
  console.log("Referências (arranjo correto):");
  for (const r of refs) console.log(`  ${r.nome.padEnd(22)} layout=${r.layout}`);

  console.log(`\n${cat.nome}: layout "${cat.layout}" → "${LAYOUT_NOVO}"`);
  if (cat.layout === LAYOUT_NOVO) {
    console.log("  já está correto — nada a fazer.");
    return;
  }

  if (!APLICAR) {
    console.log("\nNada foi gravado. Rode com --yes para aplicar.");
    return;
  }

  await client.patch(cat._id).set({ layout: LAYOUT_NOVO }).commit();
  console.log(`\n✅ layout de "${cat.nome}" alterado para "${LAYOUT_NOVO}".`);
}

main().catch((err) => { console.error("Erro fatal:", err); process.exit(1); });
