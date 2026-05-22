import { client } from "@/sanity/client";
import ProdutosClient from "./components/ProdutosClient";

const CATEGORIAS_QUERY = `*[_type == "categoria"] | order(nome asc) {
  _id,
  nome,
  subcategorias[] {
    _key,
    nome
  }
}`;

const PRODUTOS_QUERY = `*[_type == "produto"] | order(nome asc) {
  _id,
  nome,
  slug,
  marca,
  tipo,
  descricao,
  imagem,
  categoria-> {
    _id,
    nome
  },
  subcategoria
}`;

export const metadata = {
  title: "Produtos | RR Mangueiras",
  description:
    "Conheça nossa linha completa de mangueiras hidráulicas, conexões e componentes industriais.",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [categorias, produtos, params] = await Promise.all([
    client.fetch(CATEGORIAS_QUERY),
    client.fetch(PRODUTOS_QUERY),
    searchParams,
  ]);

  return (
    <ProdutosClient
      categorias={categorias}
      produtos={produtos}
      initialSearch={params.q ?? ""}
    />
  );
}
