/**
 * Script de importação em massa de produtos para o Sanity
 *
 * Uso:
 *   node scripts/import-produtos.mjs ./caminho/para/produtos.csv
 *
 * O CSV deve ter as colunas:
 *   nome, marca, tipo, categoria, subcategoria, descricao, imagem, codigo
 *
 * Os headers são flexíveis (case-insensitive, ignoram acentos):
 *   "Nome", "NOME", "nome" → tudo funciona
 *   "Descrição", "Descricao", "descrição" → tudo funciona
 *   "Código", "codigo", "CODIGO" → tudo funciona
 *
 * - "categoria" deve ser o nome exato (ex: "Abraçadeiras", "Conexões")
 * - "subcategoria" é opcional (ex: "Inox", "Aço Carbono")
 * - "imagem" pode ser:
 *     - URL (http/https) → será baixada e enviada ao Sanity
 *     - Caminho local de arquivo (ex: ./imagens/foto.jpg)
 * - "descricao" é opcional
 */

import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "fs";
import csvParser from "csv-parser";
import { resolve, extname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

// ============================================================
// CONFIGURAÇÃO - Edite aqui se necessário
// ============================================================
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// ⚠️ Você precisa de um token de ESCRITA do Sanity!
// Crie em: https://www.sanity.io/manage → projeto → API → Tokens → Add API Token (Editor)
const TOKEN = process.env.SANITY_API_TOKEN;

if (!PROJECT_ID) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID não encontrado no .env");
  process.exit(1);
}

if (!TOKEN) {
  console.error("❌ SANITY_API_TOKEN não encontrado no .env");
  console.error(
    "   Crie um token em: https://www.sanity.io/manage → seu projeto → API → Tokens"
  );
  console.error('   Depois adicione no .env: SANITY_API_TOKEN="seu-token"');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normaliza os headers do CSV para ignorar maiúsculas/minúsculas e acentos.
 * Ex: "Nome" → "nome", "Descrição" → "descricao", "Código" → "codigo"
 */
function normalizeHeader(header) {
  return header
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Busca ou cria a categoria no Sanity.
 * Retorna o _id da categoria.
 */
async function getOrCreateCategoria(nomeCategoria) {
  // Buscar categoria existente
  const existing = await client.fetch(
    `*[_type == "categoria" && nome == $nome][0]{ _id }`,
    { nome: nomeCategoria }
  );

  if (existing) {
    return existing._id;
  }

  // Criar nova categoria
  console.log(`  📁 Criando categoria: ${nomeCategoria}`);
  const created = await client.create({
    _type: "categoria",
    nome: nomeCategoria,
    slug: { _type: "slug", current: slugify(nomeCategoria) },
  });

  return created._id;
}

/**
 * Faz upload de uma imagem para o Sanity.
 * Aceita URL (http/https) ou caminho local.
 */
async function uploadImage(imagemPath) {
  if (!imagemPath || imagemPath.trim() === "") {
    return null;
  }

  try {
    if (imagemPath.startsWith("http://") || imagemPath.startsWith("https://")) {
      // Download da URL e upload para o Sanity
      console.log(`  🖼️  Baixando imagem: ${imagemPath.substring(0, 60)}...`);
      const response = await fetch(imagemPath);

      if (!response.ok) {
        console.error(`  ⚠️  Falha ao baixar imagem: ${response.status}`);
        return null;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const ext = contentType.includes("png") ? ".png" : ".jpg";

      const asset = await client.assets.upload("image", buffer, {
        filename: `produto${ext}`,
        contentType,
      });

      return {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
    } else {
      // Arquivo local
      const absolutePath = resolve(imagemPath);
      console.log(`  🖼️  Enviando imagem local: ${absolutePath}`);

      const ext = extname(absolutePath).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : "image/jpeg";

      const buffer = readFileSync(absolutePath);
      const asset = await client.assets.upload("image", buffer, {
        filename: `produto${ext}`,
        contentType,
      });

      return {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
    }
  } catch (error) {
    console.error(
      `  ⚠️  Erro ao processar imagem: ${error.message}`
    );
    return null;
  }
}

/**
 * Lê o CSV e retorna array de objetos.
 */
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath, { encoding: "utf-8" })
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => normalizeHeader(header),
          mapValues: ({ value }) => value.trim(),
        })
      )
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// ============================================================
// IMPORTAÇÃO PRINCIPAL
// ============================================================
async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error("❌ Uso: node scripts/import-produtos.mjs ./caminho/para/produtos.csv");
    process.exit(1);
  }

  console.log("🚀 Iniciando importação de produtos...");
  console.log(`📄 Arquivo: ${csvPath}`);
  console.log(`📦 Projeto: ${PROJECT_ID} / ${DATASET}`);
  console.log("");

  // Ler CSV
  const rows = await readCSV(resolve(csvPath));
  console.log(`📋 ${rows.length} produtos encontrados no CSV\n`);

  // Cache de categorias (para não buscar/criar repetidamente)
  const categoriaCache = {};

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const { nome, marca, tipo, categoria, subcategoria, descricao, imagem, codigo } =
      row;

    console.log(
      `[${i + 1}/${rows.length}] ${nome} - ${marca} (${categoria})`
    );

    // Validação básica
    if (!nome || !marca || !tipo || !categoria) {
      console.error(
        `  ❌ Campos obrigatórios faltando (nome, marca, tipo, categoria). Pulando.`
      );
      errorCount++;
      continue;
    }

    try {
      // 1. Obter ID da categoria
      if (!categoriaCache[categoria]) {
        categoriaCache[categoria] = await getOrCreateCategoria(categoria);
      }
      const categoriaId = categoriaCache[categoria];

      // 2. Upload da imagem (se houver)
      const imagemAsset = await uploadImage(imagem);

      // 3. Gerar slug
      const slugText = `${nome}-${marca}-${tipo}`;
      const slug = slugify(slugText);

      // 4. Verificar se já existe (pelo slug)
      const existing = await client.fetch(
        `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      if (existing) {
        console.log(`  ⏭️  Já existe (slug: ${slug}). Pulando.`);
        continue;
      }

      // 5. Criar documento
      const doc = {
        _type: "produto",
        nome,
        slug: { _type: "slug", current: slug },
        marca,
        tipo,
        categoria: { _type: "reference", _ref: categoriaId },
      };

      if (descricao) doc.descricao = descricao;
      if (subcategoria) doc.subcategoria = subcategoria;
      if (codigo) doc.codigo = codigo;
      if (imagemAsset) doc.imagem = imagemAsset;

      await client.create(doc);
      console.log(`  ✅ Importado com sucesso!`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Erro: ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log(`✅ Importados: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`⏭️  Pulados: ${rows.length - successCount - errorCount}`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
