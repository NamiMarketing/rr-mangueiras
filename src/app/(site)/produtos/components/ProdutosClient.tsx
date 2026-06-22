"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { StaticImageData } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import styles from "../produtos.module.css";
import { urlFor } from "@/sanity/image";
import destaqueAbracadeiras from "@/img/produtos/destaque-abracadeiras.png";
import destaqueEngates from "@/img/produtos/destaque-engates.png";
import destaqueMangueiraKpuc from "@/img/produtos/destaque-mangueira-kpuc.png";
import destaqueGalvanizado from "@/img/produtos/destaque-galvanizado.png";
import destaqueAcoInox from "@/img/produtos/destaque-aco-inox.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Destaque {
  image: StaticImageData;
  alt: string;
  categoria: string;
}

// Carrossel de destaques fixo (imagens promocionais). `categoria` casa com o
// nome de uma categoria do CMS para filtrar ao clicar (ignorado se não houver).
const DESTAQUES: Destaque[] = [
  { image: destaqueAbracadeiras, alt: "Abraçadeiras", categoria: "Abraçadeiras" },
  { image: destaqueEngates, alt: "Engates", categoria: "Engates" },
  { image: destaqueMangueiraKpuc, alt: "Mangueira KPU-C", categoria: "PUC" },
  { image: destaqueGalvanizado, alt: "Galvanizado", categoria: "Tubos e Conexões" },
  { image: destaqueAcoInox, alt: "Aço Inox", categoria: "Tubos e Conexões" },
];

interface Subcategoria {
  _key: string;
  nome: string;
}

interface Categoria {
  _id: string;
  nome: string;
  subcategorias?: Subcategoria[];
}

interface Produto {
  _id: string;
  nome: string;
  slug: { current: string };
  tipo?: string;
  descricao?: string;
  imagem: SanityImageSource;
  categoria: {
    _id: string;
    nome: string;
  };
  subcategoria?: string;
}

interface ProdutosClientProps {
  categorias: Categoria[];
  produtos: Produto[];
}

export default function ProdutosClient({
  categorias,
  produtos,
}: ProdutosClientProps) {
  // Lê o termo de busca da URL (?q=) no cliente — compatível com export estático.
  const [searchTerm, setSearchTerm] = useState<string>(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("q") ?? ""
      : ""
  );
  const [selectedCategoria, setSelectedCategoria] = useState("");

  const handleSelectCategoria = (categoriaId: string) => {
    setSearchTerm("");
    setSelectedCategoria(categoriaId);
  };

  const handleSelectByName = (nome: string) => {
    const cat = categorias.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase()
    );
    if (cat) handleSelectCategoria(cat._id);
  };

  const isSearching = searchTerm.trim().length > 0;

  // Categoria efetiva: a selecionada, ou a primeira por padrão.
  const categoriaAtiva = selectedCategoria || categorias[0]?._id || "";

  const produtosExibidos = useMemo(() => {
    if (isSearching) {
      const term = searchTerm.toLowerCase();
      return produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(term) ||
          (p.tipo ?? "").toLowerCase().includes(term) ||
          (p.descricao ?? "").toLowerCase().includes(term) ||
          p.categoria.nome.toLowerCase().includes(term)
      );
    }
    return produtos.filter((p) => p.categoria._id === categoriaAtiva);
  }, [produtos, searchTerm, categoriaAtiva, isSearching]);

  const tituloLista = isSearching
    ? `Resultados para "${searchTerm}"`
    : categorias.find((c) => c._id === categoriaAtiva)?.nome ?? "Produtos";

  return (
    <div className={styles.page}>
      {/* ===== Carrossel de destaques (fixo) ===== */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerPrev} id="produtos-banner-prev" aria-label="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{ prevEl: "#produtos-banner-prev", nextEl: "#produtos-banner-next" }}
            pagination={{ el: "#produtos-banner-pagination", clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 12 },
              768: { slidesPerView: 2, spaceBetween: 20 },
            }}
            className={styles.bannerSwiper}
          >
            {DESTAQUES.map((destaque) => (
              <SwiperSlide key={destaque.alt}>
                <button
                  type="button"
                  className={styles.bannerCard}
                  onClick={() => handleSelectByName(destaque.categoria)}
                  aria-label={destaque.alt}
                >
                  <Image
                    src={destaque.image}
                    alt={destaque.alt}
                    className={styles.bannerImage}
                    priority
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.bannerNext} id="produtos-banner-next" aria-label="Próximo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className={styles.bannerPagination} id="produtos-banner-pagination" />
      </section>

      {/* ===== Categorias (pílulas) ===== */}
      <section className={styles.categoriasSection}>
        <h2 className={styles.categoriasTitle}>CATEGORIAS</h2>
        <div className={styles.pills}>
          {categorias.map((cat) => (
            <button
              key={cat._id}
              type="button"
              className={`${styles.pill} ${
                !isSearching && categoriaAtiva === cat._id ? styles.pillActive : ""
              }`}
              onClick={() => handleSelectCategoria(cat._id)}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Lista de itens da categoria ===== */}
      <section className={styles.catalogo}>
        <h1 className={styles.catalogoTitle}>{tituloLista}</h1>

        {produtosExibidos.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente selecionar outra categoria ou buscar por outro termo.</p>
          </div>
        ) : (
          <div className={styles.lista}>
            {produtosExibidos.map((produto) => (
              <article key={produto._id} className={styles.row}>
                <h3 className={styles.rowNome}>{produto.nome}</h3>
                <div className={styles.rowImagem}>
                  {produto.imagem && (
                    <Image
                      src={urlFor(produto.imagem).width(400).fit("max").url()}
                      alt={produto.nome}
                      width={400}
                      height={400}
                      className={styles.rowImg}
                    />
                  )}
                </div>
                {produto.descricao && (
                  <p className={styles.rowDescricao}>{produto.descricao}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
