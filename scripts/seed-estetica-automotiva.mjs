/**
 * Adiciona a categoria "Estética automotiva" (novo Figma, node 681:313) com
 * seus 26 produtos, divididos em 5 subcategorias: Acessórios, Descontaminação
 * e Polimento, Lavagem Técnica, Limpeza Interna e Higienização, Proteção e
 * Vitrificação.
 *
 * NÃO destrutivo: cria a categoria só se ainda não existir (ela não tinha
 * placeholder vazio, ao contrário de Alimentícias/Tubos e Conexões), e pula
 * produtos cujo slug já exista (idempotente).
 *
 * Uso:
 *   node scripts/seed-estetica-automotiva.mjs --yes
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

if (!process.argv.includes("--yes")) {
  console.error(
    "Rode com --yes para confirmar:\n  node scripts/seed-estetica-automotiva.mjs --yes"
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

const NOME_CATEGORIA = "Estética automotiva";
const SUBCATEGORIAS = [
  "Acessórios",
  "Descontaminação e Polimento",
  "Lavagem Técnica",
  "Limpeza Interna e Higienização",
  "Proteção e Vitrificação",
];

async function getOrCreateCategoria() {
  const existing = await client.fetch(`*[_type == "categoria" && nome == $nome][0]`, {
    nome: NOME_CATEGORIA,
  });
  if (existing) {
    console.log(`  📁 Categoria já existe: "${NOME_CATEGORIA}" (${existing._id})`);
    return existing._id;
  }
  const created = await client.create({
    _type: "categoria",
    nome: NOME_CATEGORIA,
    slug: { _type: "slug", current: slugify(NOME_CATEGORIA) },
    ordem: 11,
    subcategorias: SUBCATEGORIAS.map((nome) => ({
      _type: "object",
      _key: slugify(nome),
      nome,
    })),
  });
  console.log(`  📁 Categoria criada: "${NOME_CATEGORIA}" (${created._id})`);
  return created._id;
}

async function uploadImage(arquivo) {
  const buffer = readFileSync(resolve(__dirname, "estetica-automotiva-src", arquivo));
  const asset = await client.assets.upload("image", buffer, {
    filename: arquivo,
    contentType: "image/png",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const PRODUTOS = [
  // ── Acessórios ──
  {
    nome: "Lavadora alta pressão",
    arquivo: "01-lavadora-alta-pressao.png",
    subcategoria: "Acessórios",
    descricao:
      "Potência e eficiência para uma limpeza impecável. Com motor de indução de 2100W, pressão de até 2320 PSI e alta durabilidade, a Lavadora de Alta Pressão Pro Vonixx entrega desempenho profissional com economia de água e praticidade no uso.",
  },
  {
    nome: "Pistola lavadora alta pressão",
    arquivo: "02-pistola-lavadora-alta-pressao.png",
    subcategoria: "Acessórios",
    descricao:
      "Mais praticidade e desempenho para a sua lavadora de alta pressão. A Pistola FAST Vonixx é robusta, ergonômica e fabricada com materiais de alta resistência. Com engate rápido compatível com canhões de espuma e acessórios, suporta até 3600 PSI, proporcionando uma limpeza mais ágil, precisa e eficiente.",
  },
  {
    nome: "Pulverizador de diluição",
    arquivo: "03-pulverizador-diluicao.png",
    subcategoria: "Acessórios",
    descricao:
      "Praticidade e precisão na diluição de produtos. Fabricado em PEAD, possui marcações de volume e diluição que facilitam o preparo das soluções, garantindo mais agilidade, resistência e segurança no uso.",
  },
  {
    nome: "Luva microfibra dupla ação",
    arquivo: "04-luva-microfibra-dupla-acao.png",
    subcategoria: "Acessórios",
    descricao:
      "Luva anatômica de microfibra com dupla ação para uma limpeza eficiente e segura. Remove sujeiras incrustadas sem riscar a superfície, oferecendo alta resistência, conforto e praticidade na lavagem automotiva.",
  },
  {
    nome: "Toalha microfibra",
    arquivo: "05-toalha-microfibra.png",
    subcategoria: "Acessórios",
    descricao:
      "Toalha de microfibra sem costura, super macia e de alta absorção, ideal para secagem, remoção de ceras e acabamento. O corte a laser evita riscos na pintura, garantindo uma limpeza segura e eficiente.",
  },
  // ── Descontaminação e Polimento ──
  {
    nome: "Kit vidro riscado",
    arquivo: "06-kit-vidro-riscado.png",
    subcategoria: "Descontaminação e Polimento",
    descricao:
      "Solução completa para restaurar vidros automotivos. O Kit Vidro Riscado reúne produtos e acessórios que removem riscos superficiais, marcas d'água e contaminantes, devolvendo transparência, toque liso e excelente acabamento aos vidros.",
  },
  {
    nome: "Descontaminante ferroso",
    arquivo: "07-descontaminante-ferroso.png",
    subcategoria: "Descontaminação e Polimento",
    descricao:
      "Descontaminante ferroso de pH neutro que remove partículas de ferro, fuligem de freio oxidada e pontos de ferrugem em rodas, pintura e partes metálicas. Proporciona uma descontaminação segura e eficiente, restaurando o aspecto da superfície.",
  },
  {
    nome: "Removedor de cimento",
    arquivo: "08-removedor-cimento.png",
    subcategoria: "Descontaminação e Polimento",
    descricao:
      "Removedor de incrustações desenvolvido para eliminar resíduos de cimento com eficiência. Indicado para máquinas, tratores, caminhões e betoneiras, pode ser utilizado puro ou diluído, proporcionando uma limpeza prática e de alto desempenho.",
  },
  {
    nome: "Restaurador de vidros",
    arquivo: "09-restaurador-vidros.png",
    subcategoria: "Descontaminação e Polimento",
    descricao:
      "Restaure a transparência dos vidros com praticidade. O Prizm remove marcas de água, impurezas e contaminantes que a limpeza convencional não elimina, devolvendo brilho e excelente acabamento aos vidros automotivos.",
  },
  {
    nome: "Polidor de metais",
    arquivo: "10-polidor-metais.png",
    subcategoria: "Descontaminação e Polimento",
    descricao:
      "Polidor de metais com abrasivos especiais, carnaúba e SiO₂ que restaura, intensifica o brilho e protege superfícies metálicas por até 4 meses. Ideal para alumínio, inox, cromados, cobre, latão e outros metais, com aplicação manual ou mecânica.",
  },
  // ── Lavagem Técnica ──
  {
    nome: "Removedor de piche e colas",
    arquivo: "11-removedor-piche-colas.png",
    subcategoria: "Lavagem Técnica",
    descricao:
      "Removedor de piche e resíduos de cola com fórmula à base de solvente de laranja. Remove com eficiência resíduos de adesivos, etiquetas e sujeiras incrustadas, proporcionando uma limpeza rápida, segura e sem agredir o verniz.",
  },
  {
    nome: "Shampoo PH básico limpeza pesada",
    arquivo: "12-shampoo-ph-basico.png",
    subcategoria: "Lavagem Técnica",
    descricao:
      "Shampoo automotivo concentrado com pH levemente básico, ideal para limpezas pesadas. Remove barro, óleo e sujeiras difíceis com alta eficiência, sem agredir a superfície, proporcionando uma lavagem segura e de alto desempenho.",
  },
  {
    nome: "Shampoo desengraxante",
    arquivo: "13-shampoo-desengraxante.png",
    subcategoria: "Lavagem Técnica",
    descricao:
      "Shampoo desengraxante concentrado para limpeza pesada de motos. Remove barro, lama, graxa e óleo com alta eficiência, protegendo pintura, metais, plásticos e motor, sem agredir as superfícies.",
  },
  {
    nome: "Multilimpador Impact",
    arquivo: "14-multilimpador-impact.png",
    subcategoria: "Lavagem Técnica",
    descricao:
      "Shampoo automotivo concentrado com pH levemente básico, ideal para limpezas pesadas. Remove barro, óleo e sujeiras difíceis com alta eficiência, sem agredir a superfície, proporcionando uma lavagem segura e de alto desempenho.",
  },
  {
    nome: "Limpador de rodas e motores",
    arquivo: "15-limpador-rodas-motores.png",
    subcategoria: "Lavagem Técnica",
    descricao:
      "Limpador de alta performance para rodas e motores. Remove sujeiras pesadas com eficiência, sem agredir plástico, pintura, borracha ou metal, garantindo uma limpeza segura e excelente acabamento.",
  },
  // ── Limpeza Interna e Higienização ──
  {
    nome: "Limpador de vidros",
    arquivo: "16-limpador-vidros.png",
    subcategoria: "Limpeza Interna e Higienização",
    descricao:
      "Limpador de vidros 4 em 1 que limpa, protege, condiciona e reduz o risco de micro riscos. Proporciona toque liso, alta transparência e acabamento sem manchas, deixando os vidros com aparência de novos.",
  },
  {
    nome: "Hidracouro",
    arquivo: "17-hidracouro.png",
    subcategoria: "Limpeza Interna e Higienização",
    descricao:
      "Hidratante para couro que protege contra o ressecamento, devolve a maciez e renova o aspecto original da superfície. Sua fórmula promove hidratação profunda, mantendo bancos e revestimentos com aparência de novos.",
  },
  {
    nome: "Limpador bactericida",
    arquivo: "18-limpador-bactericida.png",
    subcategoria: "Limpeza Interna e Higienização",
    descricao:
      "Limpador bactericida 7 em 1 para estofados, carpetes e tapetes. Remove manchas, elimina odores, combate fungos e até 99,99% das bactérias, proporcionando uma limpeza profunda e higienização completa.",
  },
  {
    nome: "Limpador ultra concentrado",
    arquivo: "19-limpador-ultra-concentrado.png",
    subcategoria: "Limpeza Interna e Higienização",
    descricao:
      "Limpador ultra concentrado de alta performance para estofados, carpetes e tapetes. Sua fórmula de baixa espumação remove graxa, suor e gorduras com eficiência, sendo ideal para uso em extratoras e limpezas profissionais.",
  },
  {
    nome: "Limpador de estofados",
    arquivo: "20-limpador-estofados.png",
    subcategoria: "Limpeza Interna e Higienização",
    descricao:
      "Limpador concentrado para estofados automotivos e residenciais. Remove sujeiras profundas com alto rendimento e excelente poder de limpeza, proporcionando um acabamento eficiente e renovando a aparência dos tecidos.",
  },
  // ── Proteção e Vitrificação ──
  {
    nome: "Restaurador Plástico",
    arquivo: "21-restaurador-plastico.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Restaurador de plásticos que renova a cor, devolve o brilho e protege contra a ação do tempo. Sua fórmula com polímeros especiais revitaliza superfícies internas e externas, mantendo o aspecto de novo por muito mais tempo.",
  },
  {
    nome: "Pneu Pretinho",
    arquivo: "22-pneu-pretinho.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Revitalizador de pneus que protege, conserva e realça o brilho com efeito molhado. Sua fórmula concentrada proporciona acabamento uniforme e duradouro, deixando os pneus com aparência de novos.",
  },
  {
    nome: "Cera Spray",
    arquivo: "23-cera-spray.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Cera spray com SiO₂ que proporciona brilho intenso, toque aveludado e alta hidrorrepelência. Ideal para manutenção de superfícies vitrificadas, prolonga a proteção e renova o acabamento da pintura com aplicação rápida e prática.",
  },
  {
    nome: "Cera Maquiadora",
    arquivo: "25-cera-maquiadora.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Cera maquiadora desenvolvida para disfarçar micro riscos, renovar pinturas desgastadas e proporcionar brilho intenso. De fácil aplicação, deixa a superfície com toque liso e proteção de até 90 dias.",
  },
  {
    nome: "Shampoo PH Neutro",
    arquivo: "24-shampoo-ph-neutro.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Shampoo automotivo concentrado com pH neutro, desenvolvido para uma lavagem segura e eficiente. Sua fórmula de alta lubrificação reduz o risco de microrriscos, promove brilho e preserva a pintura durante a limpeza.",
  },
  {
    nome: "Verniz de Motor",
    arquivo: "26-verniz-motor.png",
    subcategoria: "Proteção e Vitrificação",
    descricao:
      "Verniz para motor que protege, renova e proporciona brilho às superfícies metálicas, plásticas, pintadas e mangueiras de borracha. Forma uma película resistente a altas temperaturas, garantindo proteção duradoura e acabamento impecável.",
  },
];

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}\n`);

  console.log("📁 Categoria:");
  const categoriaId = await getOrCreateCategoria();

  console.log(`\n🔧 Produtos — Estética automotiva (${PRODUTOS.length} itens):`);
  let created = 0;
  let skipped = 0;
  for (let i = 0; i < PRODUTOS.length; i++) {
    const item = PRODUTOS[i];
    const slug = slugify(`${item.nome}-estetica-automotiva`);
    console.log(`  [${i + 1}/${PRODUTOS.length}] ${item.nome}`);

    const existing = await client.fetch(
      `*[_type == "produto" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      console.log(`    ⏭️  já existe, pulando`);
      skipped++;
      continue;
    }

    const imagem = await uploadImage(item.arquivo);
    await client.create({
      _type: "produto",
      nome: item.nome,
      slug: { _type: "slug", current: slug },
      descricao: item.descricao,
      imagem,
      categoria: { _type: "reference", _ref: categoriaId },
      subcategoria: item.subcategoria,
    });
    created++;
  }

  console.log("\n========================================");
  console.log(`✅ Estética automotiva: ${created} criados, ${skipped} já existiam`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
