import styles from "./Cpra.module.css";

/**
 * Bloco "Controle Inteligente de Mangueiras — CPRA" (Figma 909:690, top 2649).
 *
 * Não é lista de produtos: é uma seção institucional que fica no meio da
 * categoria Mangueiras, entre o grupo das hidráulicas e o das industriais.
 * Por isso o conteúdo é fixo aqui, e não vem do Sanity — é texto de marketing,
 * não catálogo.
 *
 * Os ícones são servidos de /public/cpra em vez de importados por `next/image`:
 * SVG pelo next/image exigiria ligar `dangerouslyAllowSVG` no next.config, o que
 * afrouxaria a regra para todas as imagens do site. Cada um é renderizado na
 * largura/altura do próprio arquivo, como no design.
 */

interface ItemCpra {
  arquivo: string;
  largura: number;
  altura: number;
  titulo: string[];
  texto: string;
}

const ITENS: ItemCpra[] = [
  {
    arquivo: "tag-exclusiva.svg",
    largura: 32,
    altura: 33,
    titulo: ["TAG", "EXCLUSIVA"],
    texto: "Cada mangueira recebe uma TAG com código único de identificação.",
  },
  {
    arquivo: "controle-por-horimetro.svg",
    largura: 29,
    altura: 33,
    titulo: ["CONTROLE", "POR HORÍMETRO"],
    texto: "Acompanhe o tempo real de utilização da mangueira com precisão.",
  },
  {
    arquivo: "historico-completo.svg",
    largura: 21,
    altura: 33,
    titulo: ["HISTÓRICO", "COMPLETO"],
    texto:
      "Registro de todas as trocas e inspeções ao longo da vida útil da mangueira.",
  },
  {
    arquivo: "aviso-automatico.svg",
    largura: 37,
    altura: 33,
    titulo: ["AVISO", "AUTOMÁTICO"],
    texto:
      "Receba alertas por e-mail quando a troca estiver próxima, evitando paradas.",
  },
  {
    arquivo: "reposicao-rapida.svg",
    largura: 44,
    altura: 33,
    titulo: ["REPOSIÇÃO", "RÁPIDA"],
    texto: "Código interno que agiliza o processo de substituição da mangueira.",
  },
  {
    arquivo: "tecnologia-que-gera-resultados.svg",
    largura: 34,
    altura: 33,
    titulo: ["TECNOLOGIA QUE", "GERA RESULTADOS"],
    texto:
      "O CPRA transforma o controle de mangueiras em informação estratégica para o seu negócio.",
  },
];

const INTRO =
  "Cada mangueira recebe uma etiqueta resistente, anti-rasgo, feita para continuar legível mesmo nas condições mais severas de trabalho. Com seu celular, você faz a leitura do QR CODE na etiqueta, e a ficha técnica da mangueira estará disponível em instantes.";

export default function Cpra() {
  return (
    <section className={styles.bloco}>
      <h2 className={styles.titulo}>
        CONTROLE INTELIGENTE DE MANGUEIRAS - CPRA
      </h2>
      <p className={styles.intro}>{INTRO}</p>

      <ul className={styles.itens}>
        {ITENS.map((item) => (
          <li key={item.arquivo} className={styles.item}>
            <div className={styles.icone}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/cpra/${item.arquivo}`}
                alt=""
                width={item.largura}
                height={item.altura}
              />
            </div>
            <h3 className={styles.itemTitulo}>
              {item.titulo.map((linha) => (
                <span key={linha}>{linha}</span>
              ))}
            </h3>
            <p className={styles.itemTexto}>{item.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
