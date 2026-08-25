/**
 * Adiciona a categoria "Conexões e adaptadores" (Figma, node 866:456) com seus
 * 30 produtos, divididos em 4 subcategorias de conexões em latão.
 *
 * É um catálogo sem descrição — só nome e imagem — então a categoria nasce com
 * `layout: "compacto"`, que na página de produtos troca o CSS para duas colunas
 * de linhas curtas em vez da faixa larga com coluna de descrição vazia.
 *
 * A `ordem` de cada subcategoria reproduz o pareamento de colunas do Figma:
 * compressão + drenos na 1ª coluna, bicos + adaptadores na 2ª.
 *
 * NÃO destrutivo: reaproveita a categoria se já existir e pula produtos cujo
 * slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-conexoes-adaptadores.mjs         # dry-run
 *   node scripts/seed-conexoes-adaptadores.mjs --yes   # aplica
 *
 * Requer no .env:
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

const NOME_CATEGORIA = "Conexões e adaptadores";
const ORDEM_CATEGORIA = 14;
const SRC = "conexoes-adaptadores-src";

const COMPRESSAO = "Conexões latão - compressão";
const DRENOS = "Conexões latão - drenos, silenciadores e torneiras";
const BICOS = "Conexões latão - bicos para mangueira";
const ADAPTADORES = "Conexões latão - adaptadores";

// A ordem abaixo é o que pareia as colunas como no Figma: com `columns: 2`
// no CSS, os dois primeiros grupos enchem a coluna da esquerda.
const SUBCATEGORIAS = [
  { nome: COMPRESSAO, ordem: 1 },
  { nome: DRENOS, ordem: 2 },
  { nome: BICOS, ordem: 3 },
  { nome: ADAPTADORES, ordem: 4 },
];

const PRODUTOS = [
  // ── Conexões latão - compressão ──
  { nome: "Anilha 1001", arquivo: "01-anilha-1001.png", subcategoria: COMPRESSAO, ordem: 1 },
  { nome: "Porca 1002", arquivo: "02-porca-1002.png", subcategoria: COMPRESSAO, ordem: 2 },
  { nome: "União 1003", arquivo: "03-uniao-1003.png", subcategoria: COMPRESSAO, ordem: 3 },
  { nome: "União Macho 1004", arquivo: "04-uniao-macho-1004.png", subcategoria: COMPRESSAO, ordem: 4 },
  { nome: "União Fêmea 1005", arquivo: "05-uniao-femea-1005.png", subcategoria: COMPRESSAO, ordem: 5 },
  { nome: "Cotovelo Macho 1007", arquivo: "06-cotovelo-macho-1007.png", subcategoria: COMPRESSAO, ordem: 6 },
  { nome: "Cotovelo Fêmea 1008", arquivo: "07-cotovelo-femea-1008.png", subcategoria: COMPRESSAO, ordem: 7 },
  { nome: "Tee União 1009", arquivo: "08-tee-uniao-1009.png", subcategoria: COMPRESSAO, ordem: 8 },
  { nome: "Tee Macho Central 1010", arquivo: "09-tee-macho-central-1010.png", subcategoria: COMPRESSAO, ordem: 9 },

  // ── Conexões latão - drenos, silenciadores e torneiras ──
  { nome: "Silenciador Cônico 8554", arquivo: "16-silenciador-conico-8554.png", subcategoria: DRENOS, ordem: 1 },
  { nome: "Silenciador Plano 8555", arquivo: "17-silenciador-plano-8555.png", subcategoria: DRENOS, ordem: 2 },
  { nome: "Silenciador Regulador 8556", arquivo: "18-silenciador-regulador-8556.png", subcategoria: DRENOS, ordem: 3 },
  { nome: "Dreno tipo Agulha 9320", arquivo: "19-dreno-tipo-agulha-9320.png", subcategoria: DRENOS, ordem: 4 },
  { nome: "Torneira Macho x Fêmea 9266", arquivo: "20-torneira-macho-femea-9266.png", subcategoria: DRENOS, ordem: 5 },
  { nome: "Torneira Reta Macho x Fêmea 9166", arquivo: "21-torneira-reta-macho-femea-9166.png", subcategoria: DRENOS, ordem: 6 },

  // ── Conexões latão - bicos para mangueira ──
  { nome: "União para Mangueira 7003", arquivo: "10-uniao-para-mangueira-7003.png", subcategoria: BICOS, ordem: 1 },
  { nome: "Bico para Mangueira Macho 7004", arquivo: "11-bico-mangueira-macho-7004.png", subcategoria: BICOS, ordem: 2 },
  { nome: "Bico para Mangueira Fêmea 7005", arquivo: "12-bico-mangueira-femea-7005.png", subcategoria: BICOS, ordem: 3 },
  { nome: "Cotovelo Macho para Mangueira 7007", arquivo: "13-cotovelo-macho-mangueira-7007.png", subcategoria: BICOS, ordem: 4 },
  { nome: "Tee para Mangueira 7009", arquivo: "14-tee-para-mangueira-7009.png", subcategoria: BICOS, ordem: 5 },
  { nome: "Bico para Mangueira Giratório 7043", arquivo: "15-bico-mangueira-giratorio-7043.png", subcategoria: BICOS, ordem: 6 },

  // ── Conexões latão - adaptadores ──
  { nome: "Niple 6003", arquivo: "22-niple-6003.png", subcategoria: ADAPTADORES, ordem: 1 },
  { nome: "União Fêmea 6005", arquivo: "23-uniao-femea-6005.png", subcategoria: ADAPTADORES, ordem: 2 },
  { nome: "Bujão Cabeça Sextavada 6023", arquivo: "24-bujao-cabeca-sextavada-6023.png", subcategoria: ADAPTADORES, ordem: 3 },
  { nome: "Bujão Cabeça Sextavada Interna 6024", arquivo: "25-bujao-cabeca-sextavada-interna-6024.png", subcategoria: ADAPTADORES, ordem: 4 },
  { nome: "Adaptador Fêmea x Macho 6035", arquivo: "26-adaptador-femea-macho-6035.png", subcategoria: ADAPTADORES, ordem: 5 },
  { nome: "Extensão (Niple Longo) 6036", arquivo: "27-extensao-niple-longo-6036.png", subcategoria: ADAPTADORES, ordem: 6 },
  { nome: "Redutora (Bucha de Redução) 6037", arquivo: "28-redutora-bucha-reducao-6037.png", subcategoria: ADAPTADORES, ordem: 7 },
  { nome: "Cotovelo Macho x Fêmea 6041", arquivo: "29-cotovelo-macho-femea-6041.png", subcategoria: ADAPTADORES, ordem: 8 },
  { nome: "União para Painel 6046", arquivo: "30-uniao-para-painel-6046.png", subcategoria: ADAPTADORES, ordem: 9 },
];

const dadosCategoria = {
  nome: NOME_CATEGORIA,
  slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
  layout: "compacto",
  subcategorias: SUBCATEGORIAS.map((sub) => ({
    _type: "object",
    _key: slugify(sub.nome),
    nome: sub.nome,
    ordem: sub.ordem,
  })),
};

async function getOrCreateCategoria() {
  const existing = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });

  if (existing) {
    if (APLICAR) {
      await client.patch(existing._id).set(dadosCategoria).commit();
      console.log(`  📁 Categoria já existia, subcategorias/layout atualizados (${existing._id})`);
    } else {
      console.log(`  → categoria existente seria atualizada (${existing._id})`);
    }
    return existing._id;
  }

  if (!APLICAR) {
    console.log(`  → categoria "${NOME_CATEGORIA}" seria criada (ordem ${ORDEM_CATEGORIA}, layout compacto)`);
    return null;
  }

  const created = await client.create({
    _type: "categoria",
    ...dadosCategoria,
    ordem: ORDEM_CATEGORIA,
  });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, SRC, arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔍 DRY-RUN (use --yes para aplicar)\n");

  // Falha cedo se faltar imagem: melhor abortar antes de criar meia categoria.
  for (const item of PRODUTOS) {
    readFileSync(resolve(__dirname, SRC, item.arquivo));
  }
  console.log(`🖼️  ${PRODUTOS.length} imagens encontradas em scripts/${SRC}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-conexoes-adaptadores`);
    const prefixo = `  [${i + 1}/${PRODUTOS.length}] ${item.nome}`;

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      console.log(`${prefixo}\n    ⏭️  já existe, pulando`);
      skipped++;
      continue;
    }

    if (!APLICAR) {
      console.log(`${prefixo}\n    → seria criado [${item.subcategoria}]`);
      created++;
      continue;
    }

    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
      subcategoria: item.subcategoria,
      ordem: item.ordem,
    });
    console.log(`${prefixo}\n    ✅ criado`);
    created++;
  }

  console.log("\n========================================");
  console.log(
    APLICAR
      ? `✅ ${NOME_CATEGORIA}: ${created} criados, ${skipped} já existiam`
      : `🔍 Dry-run: ${created} seriam criados, ${skipped} já existem — nada foi alterado`
  );
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
