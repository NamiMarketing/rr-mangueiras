"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../produtos.module.css";
import { urlFor } from "@/sanity/image";

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
  marca: string;
  tipo: string;
  descricao?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagem: any;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedSubcategorias, setSelectedSubcategorias] = useState<string[]>(
    []
  );
  const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);

  const toggleCategoria = (categoriaId: string) => {
    setSelectedCategorias((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const toggleExpanded = (categoriaId: string) => {
    setExpandedCategorias((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const toggleSubcategoria = (subcategoriaNome: string) => {
    setSelectedSubcategorias((prev) =>
      prev.includes(subcategoriaNome)
        ? prev.filter((s) => s !== subcategoriaNome)
        : [...prev, subcategoriaNome]
    );
  };

  const limparFiltros = () => {
    setSelectedCategorias([]);
    setSelectedSubcategorias([]);
    setSearchTerm("");
  };

  const totalSelecionados =
    selectedCategorias.length + selectedSubcategorias.length;

  const filteredProdutos = useMemo(() => {
    return produtos.filter((produto) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          produto.nome.toLowerCase().includes(term) ||
          produto.marca.toLowerCase().includes(term) ||
          (produto.tipo && produto.tipo.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategorias.length > 0) {
        if (!selectedCategorias.includes(produto.categoria._id)) {
          return false;
        }
      }

      // Subcategory filter
      if (selectedSubcategorias.length > 0) {
        if (
          !produto.subcategoria ||
          !selectedSubcategorias.includes(produto.subcategoria)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [produtos, searchTerm, selectedCategorias, selectedSubcategorias]);

  return (
    <div className={styles.produtosPage}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        {/* Search */}
        <div>
          <label className={styles.searchLabel}>Pesquisar</label>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Pesquisar por produto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className={styles.categoriasHeader}>
            <span className={styles.categoriasIcon}>☰</span>
            <span className={styles.categoriasTitle}>Categorias</span>
            {totalSelecionados > 0 && (
              <button className={styles.limparTudo} onClick={limparFiltros}>
                🗑 Limpar tudo
              </button>
            )}
          </div>

          {totalSelecionados > 0 && (
            <div className={styles.selecionados}>
              <span>
                Selecionados
                <span className={styles.selecionadosBadge}>
                  {totalSelecionados}
                </span>
              </span>
              <span className={styles.selecionadosArrow}>▼</span>
            </div>
          )}

          <div className={styles.categoriasList}>
            {categorias.map((cat) => {
              const isExpanded = expandedCategorias.includes(cat._id);
              const isSelected = selectedCategorias.includes(cat._id);
              const hasSubcategorias =
                cat.subcategorias && cat.subcategorias.length > 0;

              return (
                <div key={cat._id} className={styles.categoriaItem}>
                  <button
                    className={`${styles.categoriaButton} ${
                      isSelected ? styles.active : ""
                    }`}
                    onClick={() => {
                      toggleCategoria(cat._id);
                      if (hasSubcategorias) toggleExpanded(cat._id);
                    }}
                  >
                    <span>{cat.nome}</span>
                    {hasSubcategorias && (
                      <span
                        className={`${styles.categoriaArrow} ${
                          isExpanded ? styles.open : ""
                        }`}
                      >
                        ▼
                      </span>
                    )}
                  </button>

                  {isExpanded && hasSubcategorias && (
                    <>
                      <div className={styles.subcategorias}>
                        {cat.subcategorias!.map((sub) => (
                          <button
                            key={sub._key}
                            className={`${styles.subcategoriaTag} ${
                              selectedSubcategorias.includes(sub.nome)
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => toggleSubcategoria(sub.nome)}
                          >
                            {sub.nome}
                          </button>
                        ))}
                      </div>
                      <button
                        className={styles.verTudo}
                        onClick={() => toggleCategoria(cat._id)}
                      >
                        Tudo em {cat.nome.toLowerCase()}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className={styles.mainContent}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>Produtos</h1>
          <a href="#" className={styles.catalogoButton}>
            Baixar Catálogo Digital
          </a>
        </div>

        <div className={styles.productGrid}>
          {filteredProdutos.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar seus filtros ou buscar por outro termo.</p>
            </div>
          ) : (
            filteredProdutos.map((produto) => (
              <Link
                key={produto._id}
                href={`/produtos/${produto.slug.current}`}
                className={styles.productCard}
              >
                <div className={styles.productImageWrapper}>
                  {produto.imagem && (
                    <Image
                      src={urlFor(produto.imagem).width(400).height(400).url()}
                      alt={produto.nome}
                      width={400}
                      height={400}
                      className={styles.productImage}
                    />
                  )}
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{produto.nome}</p>
                  <p className={styles.productBrand}>{produto.marca}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
