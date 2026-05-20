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
            <span className={styles.searchIcon}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5014 11.0014H11.7114L11.4314 10.7314C12.0564 10.0054 12.5131 9.15021 12.769 8.22705C13.0248 7.30389 13.0735 6.33559 12.9114 5.39144C12.4414 2.61144 10.1214 0.39144 7.32144 0.0514397C6.33706 -0.0730946 5.33723 0.0292113 4.39846 0.350529C3.4597 0.671846 2.60688 1.20366 1.90527 1.90527C1.20366 2.60688 0.671846 3.4597 0.350529 4.39846C0.0292113 5.33723 -0.0730946 6.33706 0.0514397 7.32144C0.39144 10.1214 2.61144 12.4414 5.39144 12.9114C6.33559 13.0735 7.30389 13.0248 8.22705 12.769C9.15021 12.5131 10.0054 12.0564 10.7314 11.4314L11.0014 11.7114V12.5014L15.2514 16.7514C15.6614 17.1614 16.3314 17.1614 16.7414 16.7514C17.1514 16.3414 17.1514 15.6714 16.7414 15.2614L12.5014 11.0014ZM6.50144 11.0014C4.01144 11.0014 2.00144 8.99144 2.00144 6.50144C2.00144 4.01144 4.01144 2.00144 6.50144 2.00144C8.99144 2.00144 11.0014 4.01144 11.0014 6.50144C11.0014 8.99144 8.99144 11.0014 6.50144 11.0014Z" fill="#191A32"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className={styles.categoriasHeader}>
            <span className={styles.categoriasIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H7V7H3V3ZM10 3H14V7H10V3Z" fill="#191A32"/>
                <path d="M10 3H14V7H10V3ZM17 3H21V7H17V3ZM3 17H7V21H3V17ZM10 17H14V21H10V17Z" fill="#191A32"/>
                <path d="M10 17H14V21H10V17ZM17 17H21V21H17V17ZM3 10H7V14H3V10ZM10 10H14V14H10V10Z" fill="#191A32"/>
                <path d="M10 10H14V14H10V10ZM17 10H21V14H17V10Z" fill="#191A32"/>
              </svg>
            </span>
            <span className={styles.categoriasTitle}>Categorias</span>
            {totalSelecionados > 0 && (
              <button className={styles.limparTudo} onClick={limparFiltros}>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4.33333H14.3333M6 7.66667V12.6667M9.33333 7.66667V12.6667M1.83333 4.33333L2.66667 14.3333C2.66667 14.7754 2.84226 15.1993 3.15482 15.5118C3.46738 15.8244 3.89131 16 4.33333 16H11C11.442 16 11.866 15.8244 12.1785 15.5118C12.4911 15.1993 12.6667 14.7754 12.6667 14.3333L13.5 4.33333M5.16667 4.33333V1.83333C5.16667 1.61232 5.25446 1.40036 5.41074 1.24408C5.56702 1.0878 5.77899 1 6 1H9.33333C9.55435 1 9.76631 1.0878 9.92259 1.24408C10.0789 1.40036 10.1667 1.61232 10.1667 1.83333V4.33333" stroke="#F8BB00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Limpar tudo
              </button>
            )}
          </div>

          {totalSelecionados > 0 && (
            <div className={styles.selecionados}>
              <div className={styles.selecionadosLeft}>
                <p>
                  Selecionados
                </p>
                <span className={styles.selecionadosBadge}>
                  {totalSelecionados}
                </span>
              </div>
              <span className={styles.selecionadosArrow}>
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.34901 0.214987C1.27268 0.146313 1.18288 0.092626 1.08476 0.0569906C0.986633 0.0213546 0.882096 0.00446793 0.777116 0.0072951C0.672136 0.0101227 0.568769 0.0326085 0.472916 0.0734682C0.377064 0.114328 0.290603 0.172762 0.218471 0.245435C0.146339 0.318107 0.0899478 0.403594 0.0525173 0.497015C0.0150869 0.590436 -0.00264992 0.68996 0.000319814 0.789907C0.00328955 0.889853 0.0269075 0.988265 0.0698253 1.07952C0.112743 1.17078 0.17412 1.25309 0.250452 1.32177L7.44623 7.79193C7.59468 7.92555 7.79122 8 7.99551 8C8.1998 8 8.39634 7.92555 8.54478 7.79193L15.7414 1.32177C15.8194 1.25355 15.8824 1.17125 15.9267 1.07966C15.971 0.988064 15.9957 0.889002 15.9995 0.788224C16.0033 0.687445 15.9859 0.58696 15.9486 0.492605C15.9112 0.398249 15.8545 0.311905 15.7818 0.238586C15.7091 0.165267 15.6218 0.106435 15.525 0.0655086C15.4282 0.0245822 15.3238 0.00237589 15.2179 0.000180533C15.112 -0.00201482 15.0067 0.0158432 14.9081 0.0527185C14.8095 0.0895937 14.7196 0.144751 14.6436 0.214986L7.99551 6.1919L1.34901 0.214987Z" fill="white"/>
                </svg>
              </span>
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
