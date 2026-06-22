/**
 * Seed da categoria "Abraçadeiras" com os 14 itens do Figma.
 *
 * ⚠️ DESTRUTIVO: apaga TODOS os produtos e categorias existentes antes de criar.
 *
 * Uso:
 *   node scripts/seed-abracadeiras.mjs --yes
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
  console.error(
    "❌ Faltam variáveis no .env: NEXT_PUBLIC_SANITY_PROJECT_ID e/ou SANITY_API_TOKEN."
  );
  console.error(
    "   Crie um token de escrita em https://www.sanity.io/manage → projeto → API → Tokens (Editor)"
  );
  process.exit(1);
}

if (!process.argv.includes("--yes")) {
  console.error(
    "⚠️  Este script APAGA todos os produtos e categorias existentes.\n" +
      "   Rode novamente com --yes para confirmar:\n" +
      "     node scripts/seed-abracadeiras.mjs --yes"
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

const IMG_DIR = resolve(__dirname, "abracadeiras-figma");

// As 11 categorias do design (na ordem das pílulas).
const CATEGORIAS = [
  "Abraçadeiras",
  "PUC",
  "Tubos e Conexões",
  "Linha Pneumática",
  "Linha Hidráulica",
  "Linha Industrial",
  "Linha Alimentícia",
  "Mangueiras",
  "Válvulas",
  "Engate",
  "Ar Comprimido",
];

// 14 itens da categoria Abraçadeiras (Figma node 107:480)
const ITENS = [
  {
    nome: "Borracha",
    arquivo: "01-borracha.png",
    descricao:
      "Projetadas para fixação, suporte e direcionamento dos tubos ou mangueiras em motores, chassis e estruturas. Sua abertura de borracha EPDM protege os componentes do contato direto com a fita metálica, e seu furo oblongo permite uma montagem mais fácil. São utilizadas em caminhões, ônibus, automóveis e instalações industriais.",
  },
  {
    nome: "Cron",
    arquivo: "02-cron.png",
    descricao:
      "Recomendadas para uso em mangueiras de material semirigido, possuem grande capacidade de aperto e dimensões reduzidas. O deslocamento do conjunto rosca/parafuso proporciona equilíbrio durante aplicação do torque e consequentemente a obtenção de maiores forças radiais.",
  },
  {
    nome: "Flexil®",
    arquivo: "03-flexil.png",
    descricao:
      "Recomendadas para o uso em mangueiras de material semirígido, aplicações em sistema de arrefecimento veiculares (radiadores), instalações industriais e fixação de elementos (placas, antenas, luminosos e outros itens) devido a sua grande capacidade de aperto e dimensões reduzidas.",
  },
  {
    nome: "Manga para tubos",
    arquivo: "04-manga-para-tubos.png",
    descricao:
      "Utilizadas em conexões entre tubos. São fabricadas em fitas de aço inox série 300 ou 400. Ao serem fixadas, moldam-se aos tubos promovendo uma perfeita vedação ao sistema. São usualmente empregadas em sistemas de exaustão de ônibus e caminhões.",
  },
  {
    nome: "Micro",
    arquivo: "05-micro.png",
    descricao:
      "Fabricadas com extremos ajustes de seus componentes e perfeita circularidade, proporcionando grande capacidade de vedação, mesmo com baixos índices de torque aplicado ao parafuso.",
  },
  {
    nome: "Mola",
    arquivo: "06-mola.png",
    descricao:
      "Oferecem tensão constante, e por isso são recomendadas para aplicações onde existem variações de temperatura e pressão, ou ainda acomodações do material da mangueira.",
  },
  {
    nome: "MS®",
    arquivo: "07-ms.png",
    descricao:
      "Entre todas as existentes no mercado, as que apresentam maior capacidade de aperto (torques aplicáveis de até 300 Kg x cm em eixo rígido). São indicadas para serviços pesados em mangotes e dutos de material rígido.",
  },
  {
    nome: "Presil",
    arquivo: "08-presil.png",
    descricao:
      "Indicadas para mangueiras de material macio e por não possuírem perfurações em sua fita, evitam danificar as mangueiras.",
  },
  {
    nome: "Radial",
    arquivo: "09-radial.png",
    descricao:
      "Por não apresentarem degraus e/ou desníveis em seu interior, não danificam as mangueiras. São utilizadas na indústria automobilística (dutos de combustíveis) e em sistemas hidráulicos submetidos. Apresentam circularidade perfeita e constante distribuição das forças radiais, garantindo perfeita vedação do sistema. Possuem grande capacidade de resistência à corrosão.",
  },
  {
    nome: "Simplex",
    arquivo: "10-simplex.png",
    descricao:
      "Possibilitam uma perfeita adaptação ao perfil da mangueira. Por sua concepção simples e eficiente, é indicada para uso em locais de baixa pressão, como por exemplo, os sistemas de combustível.",
  },
  {
    nome: "Tigre",
    arquivo: "11-tigre.png",
    descricao:
      "Utilizadas em conexões entre tubos sem ressaltos. São usualmente empregadas nas junções dos sistemas de exaustão de veículos comerciais e de instalações industriais. Fabricadas em fitas de aço carbono estrutural, com isso, possuem grande capacidade de aperto/fixação.",
  },
  {
    nome: "Tucho",
    arquivo: "12-tucho.png",
    descricao:
      "Recomendadas para o uso em locais que necessitam altos índices de aperto, largamente aplicados em instalações industriais, nas montadoras de ônibus, caminhões, tratores e geralmente na linha diesel.",
  },
  {
    nome: "U",
    arquivo: "13-u.png",
    descricao:
      "Recomendadas para uso em escapamentos de automóveis, caminhões, tratores, fixação de antenas e tubulações, possuindo grande resistência mecânica. São fornecidas com arruelas de pressão, disponíveis em aço carbono, sendo o cavalete zincado e o grampo bicromatizado em aço, com alto teor de carbono proporcionando o maior torque dos existentes no mercado.",
  },
  {
    nome: "ZIP",
    arquivo: "14-zip.png",
    descricao:
      "Indicadas para prender feixes de cabos, fixar elementos ou qualquer outra aplicação onde a rapidez e a segurança são fundamentais. Possui sistema de auto travamento de esfera resistente à vibração. Para um melhor desempenho, devem ser aplicadas com ferramentas especiais.",
  },
];

async function deleteAll(type) {
  const ids = await client.fetch(`*[_type == $type]._id`, { type });
  if (ids.length === 0) return 0;
  const tx = ids.reduce((t, id) => t.delete(id), client.transaction());
  await tx.commit();
  return ids.length;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(IMG_DIR, arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("🧹 Apagando produtos e categorias existentes...");
  const delProd = await deleteAll("produto");
  const delCat = await deleteAll("categoria");
  console.log(`   ✅ ${delProd} produtos e ${delCat} categorias removidos.\n`);

  console.log(`📁 Criando ${CATEGORIAS.length} categorias...`);
  const categoriaIds = {};
  for (let i = 0; i < CATEGORIAS.length; i++) {
    const nome = CATEGORIAS[i];
    const created = await client.create({
      _type: "categoria",
      nome,
      slug: { _type: "slug", current: slugify(nome) },
      ordem: i,
    });
    categoriaIds[nome] = created._id;
    console.log(`   • ${nome}`);
  }
  const categoria = { _id: categoriaIds["Abraçadeiras"] };

  console.log(`\n🔧 Criando ${ITENS.length} produtos em "Abraçadeiras"...`);
  let ok = 0;
  for (let i = 0; i < ITENS.length; i++) {
    const item = ITENS[i];
    console.log(`[${i + 1}/${ITENS.length}] ${item.nome}`);
    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slugify(`${item.nome}-abracadeiras`) },
      descricao: item.descricao,
      imagem,
      categoria: { _type: "reference", _ref: categoria._id },
    });
    ok++;
  }

  console.log("\n========================================");
  console.log(`✅ Categoria "Abraçadeiras" criada com ${ok} produtos.`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
