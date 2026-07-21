/**
 * Renomeia uma subcategoria em DOIS lugares ao mesmo tempo:
 *   1. o item no array `subcategorias` do documento da categoria;
 *   2. o campo `subcategoria` (string solta) de cada produto que a usa.
 *
 * Os dois precisam andar juntos: o agrupamento em ProdutosClient casa por
 * texto exato, então renomear só a categoria faz os produtos caírem no grupo
 * sem cabeçalho no fim da página, sem erro nenhum.
 *
 * Roda em dry-run por padrão. Uso:
 *   node scripts/rename-subcategoria.mjs          # mostra o que faria
 *   node scripts/rename-subcategoria.mjs --yes    # aplica
 *
 * Requer no .env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error("❌ Faltam NEXT_PUBLIC_SANITY_PROJECT_ID e/ou SANITY_API_TOKEN no .env");
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

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Renomeações a aplicar. `categoria` é o nome do documento de categoria.
const RENOMEACOES = [
  {
    categoria: "Engates",
    de: "Engates Camlock (ERT)",
    para: "Engate Camlock (ERT)",
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔍 DRY-RUN (use --yes para aplicar)\n");

  for (const { categoria, de, para } of RENOMEACOES) {
    console.log(`📁 ${categoria}: "${de}" → "${para}"`);

    const doc = await client.fetch(
      `*[_type == "categoria" && nome == $nome][0]{ _id, subcategorias }`,
      { nome: categoria }
    );

    if (!doc) {
      console.log(`  ❌ categoria não encontrada, pulando\n`);
      continue;
    }

    const subs = doc.subcategorias ?? [];
    const alvo = subs.find((s) => s.nome === de);

    if (!alvo) {
      console.log(`  ⏭️  subcategoria "${de}" não está na categoria (já renomeada?)`);
    } else if (APLICAR) {
      const novas = subs.map((s) =>
        s.nome === de ? { ...s, _key: slugify(para), nome: para } : s
      );
      await client.patch(doc._id).set({ subcategorias: novas }).commit();
      console.log(`  ✅ categoria atualizada (${doc._id})`);
    } else {
      console.log(`  → patch em ${doc._id}`);
    }

    const produtos = await client.fetch(
      `*[_type == "produto" && subcategoria == $de]{ _id, nome }`,
      { de }
    );

    console.log(`  🔧 ${produtos.length} produto(s) usando "${de}":`);
    for (const p of produtos) {
      if (APLICAR) {
        await client.patch(p._id).set({ subcategoria: para }).commit();
        console.log(`    ✅ ${p.nome}`);
      } else {
        console.log(`    → ${p.nome}`);
      }
    }
    console.log("");
  }

  console.log("========================================");
  console.log(APLICAR ? "✅ Concluído" : "🔍 Dry-run — nada foi alterado");
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
