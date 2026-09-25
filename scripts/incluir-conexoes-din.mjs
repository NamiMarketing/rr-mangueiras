/**
 * Ajustes.xlsx, aba "linha hidraulica", bloco CONEXÕES HIDRÁULICAS DIN:
 * inclui os 6 itens marcados "(INCLUIR NO CATÁLOGO E NO SITE)".
 *
 * NOMES: copiados da planilha, caractere por caractere — pedido explícito,
 * para o cliente reconhecer o que escreveu. Só sai a instrução final entre
 * parênteses ("(INCLUIR NO CATÁLOGO E NO SITE)"), que é recado para quem
 * executa e não parte do nome. O "(Joelho)" é nome e fica.
 *
 * IMAGENS: as da coluna B da planilha (hennings.com.br), baixadas para
 * linha-hidraulica-src/ como JPG de fundo branco e convertidas em PNG
 * transparente por scripts/remover-fundo.mjs. O nome de cada arquivo bate com
 * a URL da respectiva linha da planilha, o que confirma o mapeamento.
 *
 * Entram em "Conexões hidráulicas DIN" depois dos 9 itens que já estão lá
 * (ordem 10 a 15, na sequência da planilha), sem descrição — igual aos
 * vizinhos; a planilha manda "ATUALIZAR TODAS AS DESCRIÇÕES" mas não traz
 * o texto.
 *
 * NÃO destrutivo: pula produto cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/incluir-conexoes-din.mjs         # dry-run
 *   node scripts/incluir-conexoes-din.mjs --yes   # aplica
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env"), quiet: true });

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

const SLUG_CATEGORIA = "linha-hidraulica";
const SUBCATEGORIA = "Conexões hidráulicas DIN";
const SRC = "linha-hidraulica-src";

const PRODUTOS = [
  { nome: "Porca - PA", arquivo: "porca-din-pa.png", ordem: 10 },
  { nome: "Conexão 90° Igual (Joelho) - JIA", arquivo: "conexao-igual-90.png", ordem: 11 },
  { nome: "Conexão 90° Macho (Joelho) - JMA", arquivo: "conexao-90-rosca-npt-1.png", ordem: 12 },
  {
    nome: "Conexão 90° Macho Orientável (Joelho) - JOA",
    arquivo: "conexao-90-macho-orientavel-rosca-bspp-1-2022.png",
    ordem: 13,
  },
  { nome: "Conexão Igual Reta - UDA", arquivo: "conexao-igual-reta-2022.png", ordem: 14 },
  {
    nome: "Conexão Macho Reto Rosca Métrica - UMA",
    arquivo: "conexao-macho-reto-rosca-metrica-vedacao-com-anel-ed.png",
    ordem: 15,
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔍 DRY-RUN (use --yes para aplicar)\n");

  // Falha cedo se faltar imagem: melhor abortar antes de criar metade.
  const imagens = new Map();
  for (const p of PRODUTOS) imagens.set(p.arquivo, readFileSync(resolve(__dirname, SRC, p.arquivo)));
  console.log(`🖼️  ${imagens.size} imagens encontradas em scripts/${SRC}\n`);

  const categoria = await client.fetch(
    `*[_type == "categoria" && slug.current == $slug][0]{ _id, nome, "subs": subcategorias[].nome }`,
    { slug: SLUG_CATEGORIA }
  );
  if (!categoria) throw new Error(`categoria "${SLUG_CATEGORIA}" não encontrada`);
  // subcategoria é string solta, casada por igualdade exata: se não bater com
  // uma das subcategorias da categoria, o produto some da listagem sem erro.
  if (!categoria.subs?.includes(SUBCATEGORIA)) {
    throw new Error(`subcategoria "${SUBCATEGORIA}" não existe em ${categoria.nome}`);
  }
  console.log(`📁 ${categoria.nome} › ${SUBCATEGORIA}\n`);

  let criados = 0, pulados = 0;
  for (const [i, p] of PRODUTOS.entries()) {
    const slug = slugify(`${p.nome}-${SLUG_CATEGORIA}`);
    const prefixo = `  [${i + 1}/${PRODUTOS.length}] ${p.nome}  (ordem ${p.ordem})`;

    const existe = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existe) {
      console.log(`${prefixo}\n    ⏭️  já existe (${existe._id}), pulando`);
      pulados++;
      continue;
    }

    if (!APLICAR) {
      console.log(`${prefixo}\n    → seria criado · slug ${slug} · ${p.arquivo}`);
      criados++;
      continue;
    }

    const asset = await client.assets.upload("image", imagens.get(p.arquivo), {
      filename: p.arquivo,
      contentType: "image/png",
    });
    const doc = await client.create({
      _type: "produto",
      nome: p.nome,
      slug: { _type: "slug", current: slug },
      imagem: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      categoria: { _type: "reference", _ref: categoria._id },
      subcategoria: SUBCATEGORIA,
      ordem: p.ordem,
    });
    console.log(`${prefixo}\n    ✅ criado (${doc._id})`);
    criados++;
  }

  console.log("\n========================================");
  console.log(
    APLICAR
      ? `✅ ${criados} criados, ${pulados} já existiam`
      : `🔍 Dry-run: ${criados} seriam criados, ${pulados} já existem — nada foi alterado`
  );
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err.message ?? err);
  process.exit(1);
});
