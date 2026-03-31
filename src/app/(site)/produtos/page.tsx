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

export default async function ProdutosPage() {
  const [categorias, produtos] = await Promise.all([
    client.fetch(CATEGORIAS_QUERY),
    client.fetch(PRODUTOS_QUERY),
  ]);

  return <ProdutosClient categorias={categorias} produtos={produtos} />;
}
