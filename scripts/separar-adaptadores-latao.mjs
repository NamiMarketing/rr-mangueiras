/**
 * Tira "Adaptadores em Latão" de dentro de "Conexões em Latão" e faz dela uma
 * categoria própria — como na planilha Ajustes.xlsx, que já trata as duas como
 * abas separadas.
 *
 * Numa única transação:
 *   1. cria a categoria "Adaptadores em Latão" (layout "auto", sem subcategorias)
 *   2. move para ela os produtos cuja subcategoria é "Adaptadores em Latão",
 *      limpando o campo `subcategoria` (a categoria nova não tem subcategorias)
 *   3. remove a subcategoria "Adaptadores em Latão" de "Conexões em Latão"
 *
 * Tudo ou nada: não existe estado intermediário com produtos órfãos, nem
 * categoria nova vazia.
 *
 * LAYOUT "auto" e não "compacto": em "compacto" os GRUPOS correm lado a lado,
 * e com um grupo só a lista inteira ficaria espremida em meia largura. Em
 * "auto", um grupo sem descrições vira compacto com os ITENS em duas colunas.
 *
 * Os slugs dos produtos NÃO mudam (terminam em "-conexoes-adaptadores", do
 * nome antigo): slug é a URL de /produtos/[slug].
 *
 * Uso:
 *   node scripts/separar-adaptadores-latao.mjs         # dry-run
 *   node scripts/separar-adaptadores-latao.mjs --yes   # aplica
 */

import { createClient } from "@sanity/client";
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

const SLUG_ORIGEM = "conexoes-em-latao";
const NOME_NOVA = "Adaptadores em Latão";
const SLUG_NOVA = "adaptadores-em-latao";
const SUBCATEGORIA = "Adaptadores em Latão";
// Id fixo: a mesma transação cria a categoria e aponta os produtos para ela,
// e rodar de novo não duplica.
const ID_NOVA = "categoria-adaptadores-em-latao";
// As pílulas são ordenadas por nome no site; `ordem` só desempata a consulta.
// 16 fica depois de todas as existentes, sem empatar com nenhuma.
const ORDEM_NOVA = 16;

async function main() {
  console.log(`📦 Projeto ${PROJECT_ID} / ${DATASET}`);
  console.log(APLICAR ? "⚠️  MODO APLICAR\n" : "🔍 DRY-RUN (use --yes para aplicar)\n");

  const origem = await client.fetch(
    `*[_type == "categoria" && slug.current == $slug][0]{ _id, nome, subcategorias[]{ _key, nome } }`,
    { slug: SLUG_ORIGEM }
  );
  if (!origem) throw new Error(`categoria "${SLUG_ORIGEM}" não encontrada`);

  const jaExiste = await client.fetch(
    `*[_type == "categoria" && (slug.current == $slug || _id == $id)][0]{ _id }`,
    { slug: SLUG_NOVA, id: ID_NOVA }
  );
  if (jaExiste && jaExiste._id !== ID_NOVA) {
    throw new Error(`já existe outra categoria com o slug "${SLUG_NOVA}" (${jaExiste._id})`);
  }

  const sub = origem.subcategorias?.find((s) => s.nome === SUBCATEGORIA);
  const produtos = await client.fetch(
    `*[_type == "produto" && categoria._ref == $id && subcategoria == $sub] | order(ordem asc){ _id, nome }`,
    { id: origem._id, sub: SUBCATEGORIA }
  );
  const ficam = await client.fetch(
    `count(*[_type == "produto" && categoria._ref == $id && subcategoria != $sub])`,
    { id: origem._id, sub: SUBCATEGORIA }
  );

  console.log(`📁 ${origem.nome} (${origem._id})`);
  console.log(`   subcategoria "${SUBCATEGORIA}": ${sub ? `encontrada (_key ${sub._key})` : "já não existe"}`);
  console.log(`   ${produtos.length} produtos saem, ${ficam} ficam\n`);
  console.log(`📁 ${NOME_NOVA} (${ID_NOVA}) — ${jaExiste ? "já existe, será reaproveitada" : "será criada"}\n`);
  produtos.forEach((p, i) => console.log(`  [${i + 1}/${produtos.length}] ${p.nome}`));

  if (!produtos.length && !sub) {
    console.log("\nNada a fazer — a separação já foi aplicada.");
    return;
  }

  if (!APLICAR) {
    console.log(`\n🔍 Dry-run: ${produtos.length} produtos seriam movidos — nada foi alterado`);
    return;
  }

  const tx = client.transaction();
  tx.createIfNotExists({
    _id: ID_NOVA,
    _type: "categoria",
    nome: NOME_NOVA,
    slug: { _type: "slug", current: SLUG_NOVA },
    ordem: ORDEM_NOVA,
    layout: "auto",
  });
  for (const p of produtos) {
    tx.patch(p._id, (patch) =>
      patch.set({ categoria: { _type: "reference", _ref: ID_NOVA } }).unset(["subcategoria"])
    );
  }
  if (sub) {
    tx.patch(origem._id, (patch) => patch.unset([`subcategorias[_key=="${sub._key}"]`]));
  }
  const res = await tx.commit();

  console.log("\n========================================");
  console.log(`✅ ${produtos.length} produtos movidos para "${NOME_NOVA}" (transação ${res.transactionId})`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Erro fatal:", err.message ?? err);
  process.exit(1);
});
