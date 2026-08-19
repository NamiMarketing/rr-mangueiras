/**
 * Adiciona a categoria "Tubos flexíveis inox" (novo Figma, node 832:505) com
 * seus 8 produtos, divididos em duas subcategorias — mesmo padrão de
 * Alimentícias e sanitárias (lista com cabeçalho amarelo por subcategoria).
 *
 * A ordem do Figma não é alfabética ("Disponível nas configurações:" vem antes
 * de "Conexões disponíveis:", e dentro dela Rosca BSP vem antes de Flanges),
 * então cada subcategoria e cada produto levam um campo `ordem` — é ele que a
 * página usa para ordenar. Quem não tem `ordem` (todo o catálogo antigo)
 * continua alfabético.
 *
 * NÃO destrutivo: cria a categoria só se ainda não existir, e para produtos
 * cujo slug já exista apenas atualiza `subcategoria`/`ordem` (nome, descrição
 * e imagem ficam como estão). Idempotente.
 *
 * Uso:
 *   node scripts/seed-tubos-flexiveis-inox.mjs --yes
 *
 * Requer em .env.local ou .env (os dois são lidos, .env.local tem prioridade):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (token de ESCRITA / Editor)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// O app usa .env.local (project id / dataset); o token de escrita costuma
// ficar no .env. Lemos os dois — dotenv não sobrescreve o que já foi definido,
// então .env.local vence nos valores em comum.
config({ path: resolve(__dirname, "..", ".env.local") });
config({ path: resolve(__dirname, "..", ".env") });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error("❌ Faltam NEXT_PUBLIC_SANITY_PROJECT_ID e/ou SANITY_API_TOKEN no .env");
  process.exit(1);
}

if (!process.argv.includes("--yes")) {
  console.error(
    "Rode com --yes para confirmar:\n  node scripts/seed-tubos-flexiveis-inox.mjs --yes"
  );
  process.exit(1);
}

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

const NOME_CATEGORIA = "Tubos flexíveis inox";
const DIR_IMAGENS = "tubos-flexiveis-inox-src";

// Os dois cabeçalhos amarelos da página, na ordem do Figma.
const SUB_CONFIGURACOES = "Disponível nas configurações:";
const SUB_CONEXOES = "Conexões disponíveis:";

const SUBCATEGORIAS = [
  { nome: SUB_CONFIGURACOES, ordem: 1 },
  { nome: SUB_CONEXOES, ordem: 2 },
];

async function getOrCreateCategoria() {
  const subcategorias = SUBCATEGORIAS.map((sub) => ({
    _type: "object",
    _key: slugify(sub.nome),
    nome: sub.nome,
    ordem: sub.ordem,
  }));

  const existing = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });

  if (existing) {
    // Só reescreve as subcategorias (nomes/ordem) — o resto do doc fica intacto.
    await client.patch(existing._id).set({ subcategorias }).commit();
    console.log(`  📁 Categoria já existe: "${NOME_CATEGORIA}" (${existing._id}) — subcategorias atualizadas`);
    return existing._id;
  }

  const created = await client.create({
    _type: "categoria",
    nome: NOME_CATEGORIA,
    slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
    ordem: 13,
    subcategorias,
  });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, DIR_IMAGENS, arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const PRODUTOS = [
  // ── Disponível nas configurações: ──
  {
    nome: "IS-0",
    arquivo: "01-is-0.png",
    subcategoria: SUB_CONFIGURACOES,
    ordem: 1,
    descricao: "Tubo sanfonado sem malha externa",
  },
  {
    nome: "IS-1",
    arquivo: "02-is-1.png",
    subcategoria: SUB_CONFIGURACOES,
    ordem: 2,
    descricao: "Tubo sanfonado com uma malha trançada em aço inox.",
  },
  {
    nome: "IS-2",
    arquivo: "03-is-2.png",
    subcategoria: SUB_CONFIGURACOES,
    ordem: 3,
    descricao:
      "Tubo sanfonado com dupla malha trançada para aplicações de maior pressão.",
  },

  // ── Conexões disponíveis: ──
  {
    nome: "Rosca BSP",
    arquivo: "04-rosca-bsp.png",
    subcategoria: SUB_CONEXOES,
    ordem: 4,
    descricao:
      "Rosca de padrão britânico, disponível nas versões paralela (BSPP) e cônica (BSPT).",
  },
  {
    nome: "Rosca NPT",
    arquivo: "05-rosca-npt.png",
    subcategoria: SUB_CONEXOES,
    ordem: 5,
    descricao:
      "Rosca cônica de padrão americano. A vedação ocorre pela interferência das roscas, normalmente com fita PTFE ou vedante líquido.",
  },
  {
    nome: "Tubo para solda (OD)",
    arquivo: "06-tubo-para-solda.png",
    subcategoria: SUB_CONEXOES,
    ordem: 6,
    descricao:
      "Terminal com diâmetro externo calibrado para soldagem orbital ou convencional.",
  },
  {
    nome: "Flanges",
    arquivo: "07-flanges.png",
    subcategoria: SUB_CONEXOES,
    ordem: 7,
    descricao:
      "Indicados para linhas de grande diâmetro e alta vazão. Disponíveis conforme normas ANSI, DIN e JIS.",
  },
  {
    nome: "Fêmea giratória",
    arquivo: "08-femea-giratoria.png",
    subcategoria: SUB_CONEXOES,
    ordem: 8,
    descricao:
      "Conexão com porca giratória que permite a instalação sem torcer o tubo flexível, facilitando a montagem.",
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos — ${NOME_CATEGORIA} (${PRODUTOS.length} itens):`);
  let created = 0;
  let updated = 0;
  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-tubos-flexiveis-inox`);
    console.log(`  [${i + 1}/${PRODUTOS.length}] ${item.nome}`);

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      await client
        .patch(existing._id)
        .set({ subcategoria: item.subcategoria, ordem: item.ordem })
        .commit();
      console.log(`    ♻️  já existe, subcategoria/ordem atualizadas`);
      updated++;
      continue;
    }

    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      descricao: item.descricao,
      subcategoria: item.subcategoria,
      ordem: item.ordem,
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
    });
    created++;
  }

  console.log("\n========================================");
  console.log(`✅ ${NOME_CATEGORIA}: ${created} criados, ${updated} atualizados`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
