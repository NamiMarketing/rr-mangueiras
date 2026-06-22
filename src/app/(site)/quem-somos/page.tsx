import styles from "./page.module.css";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import hero from "@/img/quem-somos/hero.png";
import equipe from "@/img/quem-somos/equipe.png";
import icoExperiencia from "@/img/quem-somos/ico-experiencia.png";
import icoMarcas from "@/img/quem-somos/ico-marcas.png";
import icoPreco from "@/img/quem-somos/ico-preco.png";
import icoGarantias from "@/img/quem-somos/ico-garantias.png";
import icoTecnico from "@/img/quem-somos/ico-tecnico.png";
import icoMulticanal from "@/img/quem-somos/ico-multicanal.png";

interface Beneficio {
  icon: StaticImageData;
  title: string;
  description: string;
}

const beneficios: Beneficio[] = [
  {
    icon: icoExperiencia,
    title: "Experiência",
    description:
      "Mais de 3 décadas comercializando mangueiras e terminais com qualidade e responsabilidade técnica.",
  },
  {
    icon: icoMarcas,
    title: "Melhores marcas",
    description:
      "Trabalhamos com fabricantes reconhecidos nacional e internacionalmente, certificados pelas normas ISO 9001, ISO 14001 e IATF 16949.",
  },
  {
    icon: icoPreco,
    title: "Melhor custo benefício",
    description:
      "Produtos de qualidade com preço competitivo e estoque disponível para entrega imediata.",
  },
  {
    icon: icoGarantias,
    title: "Gestão de Garantias",
    description:
      "Respaldo completo aos nossos clientes no processo de acionamento de eventuais garantias, considerando a logística e as diretrizes de cada fabricante.",
  },
  {
    icon: icoTecnico,
    title: "Atendimento técnico especializado",
    description:
      "Nossa equipe orienta na escolha correta do produto para cada aplicação, evitando retrabalho, desperdício e falhas no sistema.",
  },
  {
    icon: icoMulticanal,
    title: "Atendimento multicanal",
    description:
      "Você pode ser atendido em uma de nossas unidades físicas, receber uma visita técnica agendada, ou pelo telefone e WhatsApp, do jeito que for mais prático para você.",
  },
];

export default function QuemSomos() {
  return (
    <main>
      <section className={styles.hero}>
        <Image src={hero} alt="Equipe RR Mangueiras" className={styles.heroImage} priority />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>QUEM SOMOS</h1>
        </div>
      </section>

      <section className={styles.intro}>
        <span className={styles.introCurve} aria-hidden />
        <div className={styles.introInner}>
          <p className={styles.introLead}>
            A RR Mangueiras é uma empresa paranaense especializada na comercialização de
            mangueiras hidráulicas e industriais, conexões, terminais e válvulas para os mais
            variados segmentos do mercado.
          </p>
          <p className={styles.introBody}>
            Atuamos com mangueiras de baixa, média, alta e super pressão há mais de três décadas,
            mantendo parcerias com marcas líderes do setor e um portfólio amplo para atender desde
            a manutenção do dia a dia até as aplicações industriais mais exigentes.
          </p>
        </div>
      </section>

      <section className={styles.equipe}>
        <Image src={equipe} alt="Equipe RR Mangueiras" className={styles.equipeImage} />
        <div className={styles.equipeOverlay} />
        <div className={styles.equipeContent}>
          <p>
            Nossa equipe é formada por profissionais qualificados, atentos às demandas do mercado
            e prontos para oferecer orientação técnica e atendimento personalizado.
          </p>
          <h2>Aqui você não compra só um produto, compra a solução certa para o seu negócio.</h2>
        </div>
      </section>

      <section className={styles.escolher}>
        <div className={styles.escolherInner}>
          <h2 className={styles.escolherTitle}>Por que escolher a RR Mangueiras?</h2>
          <div className={styles.grid}>
            {beneficios.map((item) => (
              <div key={item.title} className={styles.card}>
                <div className={styles.cardIcon}>
                  <Image src={item.icon} alt={item.title} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
