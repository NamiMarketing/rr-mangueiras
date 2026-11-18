"use client";

import { Fragment, useState, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import styles from "../produtos.module.css";
import { urlFor } from "@/sanity/image";
import Cpra from "@/components/Cpra/Cpra";

// O bloco CPRA é institucional e existe só na categoria Mangueiras: o Figma
// (909:690) o coloca entre o grupo das hidráulicas e o das industriais.
const CPRA_DEPOIS_DE = "Mangueiras Hidráulicas";

interface Subcategoria {
  _key: string;
  nome: string;
  /** Título maior que reúne várias subcategorias (ex: "Conexões de latão"). */
  pai?: string;
  ordem?: number;
}

interface Categoria {
  _id: string;
  nome: string;
  slug?: string;
  /** Controla o CSS da listagem. Ver `grupos`. */
  layout?: "auto" | "padrao" | "compacto";
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
  // A query string é um estado do navegador, não do React: numa navegação
  // client-side o window.location ainda está defasado no primeiro render (medido:
  // no render vem "", só no commit vira "?categoria=..."). useSyncExternalStore
  // relê o snapshot após a montagem e re-renderiza se mudou, que é exatamente o
  // que precisamos — sem setState dentro de efeito.
  //
  // Não usamos useSearchParams do next/navigation de propósito: ele exigiria um
  // limite de Suspense e, com output:"export", jogaria a listagem inteira para
  // client-side — o /produtos/index.html sairia com o <main> vazio, sem produto
  // nenhum para indexação. (Testado: <article> e <h2> zerados.)
  //
  // subscribe é no-op porque nada muda a URL sem remontar esta página; o
  // snapshot do servidor é "" para o HTML estático sair com a 1ª categoria.
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => ""
  );

  const termoDaUrl = useMemo(
    () => new URLSearchParams(search).get("q") ?? "",
    [search]
  );
  // Casa pelo slug (estável), não pelo nome.
  const categoriaDaUrl = useMemo(() => {
    const slug = new URLSearchParams(search).get("categoria");
    if (!slug) return "";
    return categorias.find((c) => c.slug === slug)?._id ?? "";
  }, [search, categorias]);

  // Assim que o usuário clica numa pílula, a escolha dele passa a mandar e a
  // URL deixa de importar. null = ainda não escolheu nada na mão.
  const [escolha, setEscolha] = useState<{ categoriaId: string; termo: string } | null>(null);

  const selectedCategoria = escolha ? escolha.categoriaId : categoriaDaUrl;
  const searchTerm = escolha ? escolha.termo : termoDaUrl;

  // Apenas categorias que possuem ao menos um produto cadastrado — categorias
  // vazias não são exibidas nas pílulas. Ordenadas alfabeticamente.
  const categoriasAtivas = useMemo(() => {
    const idsComProdutos = new Set(
      produtos.map((p) => p.categoria?._id).filter(Boolean)
    );
    return categorias
      .filter((c) => idsComProdutos.has(c._id))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [categorias, produtos]);

  const handleSelectCategoria = (categoriaId: string) => {
    // Escolher categoria zera a busca: a lista passa a ser a da categoria.
    setEscolha({ categoriaId, termo: "" });
    // As pílulas são sticky; ao trocar de categoria a lista é substituída mas a
    // rolagem fica onde estava. Voltamos ao topo para o usuário começar a ver a
    // nova categoria desde o primeiro item. (Scroll instantâneo — o "smooth" é
    // ignorado aqui por conta do layout sticky.)
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const isSearching = searchTerm.trim().length > 0;

  // Categoria efetiva: a selecionada, ou a primeira por padrão.
  const categoriaAtiva = selectedCategoria || categoriasAtivas[0]?._id || "";
  const categoriaAtivaObj = categoriasAtivas.find((c) => c._id === categoriaAtiva);

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

  // Quando a categoria ativa tem subcategorias cadastradas (ex: Alimentícias
  // e sanitárias → Conexões/Mangueiras/Válvulas), agrupa a lista em seções
  // com cabeçalho. A ordem do array no CMS depende de como foi arrastado no
  // Studio, então ordenamos aqui: pelo campo `ordem` da subcategoria e, em
  // caso de empate (o padrão, `ordem` = 0), alfabeticamente. Produtos sem
  // subcategoria (ou com uma que não está mais cadastrada) caem num grupo
  // final sem cabeçalho. Categorias sem subcategorias (Abraçadeiras, Tubos e
  // conexões PPR) e buscas continuam como lista única, sem cabeçalho.
  // Decide o layout de UM grupo. A categoria manda quando o campo `layout`
  // está preenchido; em "auto" olhamos o próprio grupo: se a maioria dos itens
  // tem descrição, vale o layout padrão (nome, imagem e descrição); senão o
  // compacto. É a maioria, e não "algum", de propósito — num grupo onde só 2
  // de 9 itens têm uma nota curta, abrir a coluna de descrição deixaria os
  // outros 7 com um vão vazio; no compacto a nota vira uma linha em itálico.
  const decidirCompacto = (
    itens: Produto[],
    escolha: Categoria["layout"]
  ): boolean => {
    if (escolha === "compacto") return true;
    if (escolha === "padrao") return false;
    const comDescricao = itens.filter((p) => p.descricao?.trim()).length;
    return comDescricao * 2 <= itens.length;
  };

  const grupos = useMemo(() => {
    const escolha = isSearching ? "padrao" : categoriaAtivaObj?.layout;
    const subcategorias = !isSearching
      ? [...(categoriaAtivaObj?.subcategorias ?? [])].sort(
          (a, b) =>
            (a.ordem ?? 0) - (b.ordem ?? 0) ||
            a.nome.localeCompare(b.nome, "pt-BR")
        )
      : [];
    const monta = (nome: string | null, pai: string | null, itens: Produto[]) => ({
      nome,
      pai,
      produtos: itens,
      compacto: decidirCompacto(itens, escolha),
      // Nenhum item com imagem (ex: as mangueiras hidráulicas, que no design
      // são só nome + descrição). Sem isso a coluna de imagem ficaria aberta
      // e vazia em todas as linhas do grupo.
      semImagem: itens.length > 0 && itens.every((p) => !p.imagem),
    });

    if (subcategorias.length === 0) {
      return [monta(null, null, produtosExibidos)];
    }

    const porSubcategoria = new Map<string, Produto[]>();
    for (const produto of produtosExibidos) {
      if (!produto.subcategoria) continue;
      const lista = porSubcategoria.get(produto.subcategoria) ?? [];
      lista.push(produto);
      porSubcategoria.set(produto.subcategoria, lista);
    }

    const resultado = [];
    for (const sub of subcategorias) {
      const itens = porSubcategoria.get(sub.nome);
      if (itens?.length) {
        resultado.push(monta(sub.nome, sub.pai?.trim() || null, itens));
        porSubcategoria.delete(sub.nome);
      }
    }

    const nomesConhecidos = new Set(subcategorias.map((s) => s.nome));
    const semGrupo = produtosExibidos.filter(
      (p) => !p.subcategoria || !nomesConhecidos.has(p.subcategoria)
    );
    if (semGrupo.length > 0) resultado.push(monta(null, null, semGrupo));

    return resultado;
  }, [produtosExibidos, categoriaAtivaObj, isSearching]);

  // Arranjo herdado das primeiras categorias compactas (Conexões e adaptadores,
  // Válvulas industriais): os grupos correm lado a lado em duas colunas. Só vale
  // quando a categoria foi marcada explicitamente como "compacto" — nos designs
  // mais novos os grupos ocupam a largura toda e são os itens que se dividem em
  // duas colunas. Para unificar, basta trocar essas categorias para "Automático".
  const gruposLadoALado =
    !isSearching && categoriaAtivaObj?.layout === "compacto";

  const tituloLista = isSearching
    ? `Resultados para "${searchTerm}"`
    : categoriasAtivas.find((c) => c._id === categoriaAtiva)?.nome ?? "Produtos";

  return (
    <div className={styles.page}>
      {/* ===== Categorias (pílulas) — fixas junto ao cabeçalho ===== */}
      <section className={styles.categoriasSection}>
        <h2 className={styles.categoriasTitle}>CATEGORIAS</h2>
        <div className={styles.pills}>
          {categoriasAtivas.map((cat) => (
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
          // O DOM é o mesmo nos dois layouts — só as classes mudam, e o CSS
          // reposiciona nome/imagem/descrição via grid-template-areas.
          <div className={gruposLadoALado ? styles.gruposCompactos : undefined}>
            {grupos.map((grupo, index) => (
              <Fragment key={grupo.nome ?? `sem-grupo-${index}`}>
              <div className={styles.subcategoriaGroup}>
                {/* Cabeçalho do grupo maior, impresso só na primeira
                    subcategoria que pertence a ele. */}
                {grupo.pai && grupo.pai !== grupos[index - 1]?.pai && (
                  <h2 className={styles.subcategoriaHeaderPai}>{grupo.pai}</h2>
                )}
                {grupo.nome && (
                  <h2 className={styles.subcategoriaHeader}>{grupo.nome}</h2>
                )}
                <div
                  className={`${styles.lista} ${
                    grupo.compacto && !gruposLadoALado ? styles.listaCompacta : ""
                  }`}
                >
                  {grupo.produtos.map((produto) => (
                    <article
                      key={produto._id}
                      className={`${styles.row} ${
                        grupo.compacto ? styles.rowCompacta : ""
                      } ${grupo.semImagem ? styles.rowSemImagem : ""}`}
                    >
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
              </div>
                {grupo.nome === CPRA_DEPOIS_DE && <Cpra />}
              </Fragment>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
