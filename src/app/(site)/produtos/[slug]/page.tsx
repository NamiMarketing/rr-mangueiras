import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./produto.module.css";
import ProdutoTabs from "./components/ProdutoTabs";
import WhatsAppModal from "@/components/WhatsAppModal/WhatsAppModal";

const PRODUTO_QUERY = `*[_type == "produto" && slug.current == $slug][0] {
  _id,
  nome,
  slug,
  tipo,
  descricao,
  imagem,
  categoria-> {
    _id,
    nome
  },
  subcategoria
}`;

const RELATED_QUERY = `*[_type == "produto" && categoria._ref == $categoriaId && _id != $produtoId][0...4] {
  _id,
  nome,
  slug,
  imagem
}`;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "produto"]{ "slug": slug.current }`
  );
  return slugs.map(({ slug }) => ({ slug }));
}

interface ProdutoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProdutoPageProps) {
  const { slug } = await params;
  const produto = await client.fetch(PRODUTO_QUERY, { slug });

  if (!produto) {
    return { title: "Produto não encontrado | RR Mangueiras" };
  }

  return {
    title: `${produto.nome} | RR Mangueiras`,
    description: produto.descricao || `${produto.nome}`,
  };
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { slug } = await params;
  const produto = await client.fetch(PRODUTO_QUERY, { slug });

  if (!produto) {
    notFound();
  }

  const relatedProducts = await client.fetch(RELATED_QUERY, {
    categoriaId: produto.categoria._id,
    produtoId: produto._id,
  });

  return (
    <div className={styles.productDetail}>
      {/* TOP SECTION */}
      <div className={styles.topSection}>
        <div className={styles.imageWrapper}>
          {produto.imagem && (
            <Image
              src={urlFor(produto.imagem).width(600).height(600).url()}
              alt={produto.nome}
              width={600}
              height={600}
              className={styles.productMainImage}
              priority
            />
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.breadcrumb}>
            <Link href="/produtos">Produtos</Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span>{produto.categoria.nome}</span>
          </div>

         

          <h1 className={styles.productTitle}>
            {produto.nome} {produto.tipo} {produto.marca}
          </h1>
          <div className={styles.imageWrapperMobile}>
            {produto.imagem && (
              <Image
                src={urlFor(produto.imagem).width(600).height(600).url()}
                alt={produto.nome}
                width={600}
                height={600}
                className={styles.productMainImage}
                priority
              />
            )}
          </div>
          {produto.descricao && (
            <p className={styles.productDescription}>{produto.descricao}</p>
          )}
          <WhatsAppModal>
            <button className="yellowButton">Falar com um especialista</button>
          </WhatsAppModal>
        </div>
      </div>

      {/* TABS */}
      {/* <ProdutoTabs descricao={produto.descricao} /> */}

      {/* RELATED PRODUCTS */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Veja também</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map(
              (related: {
                _id: string;
                nome: string;
                slug: { current: string };
                marca: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                imagem: any;
              }) => (
                <Link
                  key={related._id}
                  href={`/produtos/${related.slug.current}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrapper}>
                    {related.imagem && (
                      <Image
                        src={urlFor(related.imagem)
                          .width(300)
                          .height(400)
                          .url()}
                        alt={related.nome}
                        width={300}
                        height={400}
                        className={styles.relatedImage}
                      />
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{related.nome}</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
