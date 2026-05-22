import styles from "./home.module.css";
import Image from "next/image";
import Link from "next/link";
import banner from "@/img/banner.png";
import heroLogo from "@/img/hero-logo.png";
import preFooter from "@/img/pre-footer.png";
import preFooterMobile from "@/img/pre-footermob.png";
import curitiba from "@/img/curitiba.png";
import colombo from "@/img/colombo.png";
import pontaGrossa from "@/img/ponta-grossa.png";
import address from "@/img/icons/address.png";
import whatsapp from "@/img/icons/whatsapp.png";
import Testimonials from "@/components/Testimonials/Testimonials";
import Destaques from "@/components/Destaques/Destaques";
import Categorias from "@/components/Categorias/Categorias";
import competitivo from "@/img/competitivo.png";
import marcas from "@/img/marcas.png";
import atendimento from "@/img/atendimento.png";
import tradicao from "@/img/tradicao.png";
import tradicaoUp from "@/img/tradicao-up.png"

export default function Home() {
  return (
    <main className="main-content">
      <section className={styles.hero}>
        <Image src={banner} alt="Banner" className={styles.heroImage} />
        <div className={styles.heroBox}>
          <Image src={heroLogo} alt="Logo" />
          <p>Linha completa em mangueiras hidráulicas, conexões e componentes industriais.</p>
          <Link href="/contato">
            <button className="yellowButton">Falar com um especialista</button>
          </Link>
        </div>
      </section>

      <Categorias />

      <Destaques />

      <section className={styles.tradicao}>
        <Image src={tradicaoUp} className={styles.tradicaoUp} alt="Logo" />
        <div className={styles.tradicaoContent}>
          <div className={styles.tradicaoText}>
            <h2>Tradição e qualidade em mangueiras e terminais hidráulicos <span className={styles.textHighlight}>desde 2007.</span></h2>
            <p>
              A RR Mangueiras, empresa paranaense sediada em Curitiba, é especializada no fornecimento de mangueiras hidráulicas, terminais e conexões para aplicações industriais.
              <br /><br />
              Desde 2007, atua oferecendo produtos de baixa, média, alta e super alta pressão, com foco em qualidade, segurança e desempenho para diferentes demandas do setor industrial.
            </p>
          </div>
          <div className={styles.tradicaoImage}>
            <Image src={tradicao} alt="Foto da Fachada da RR Mangueiras" />
          </div>
        </div>
      </section>

      <section className={styles.escolher}>
        <div className={styles.escolherTitle}>
          <h2>Por que escolher a RR Mangueiras</h2>
        </div>
        <div className={styles.escolherGrid}>
          <div className={styles.escolherCard}>
            <Image src={competitivo} alt="ícone preço competitivo" />
            <div className={styles.escolherCardText}>
              <h4>Preço Competitivo</h4>
              <p>O melhor custo benefício você encontra aqui.</p>
            </div>
          </div>
          <div className={styles.escolherCard}>
            <Image src={marcas} alt="ícone melhores marcas" />
            <div className={styles.escolherCardText}>
              <h4>Melhores marcas</h4>
              <p>Peças e acessórios de fabricantes confiáveis do mercado.</p>
            </div>
          </div>
          <div className={styles.escolherCard}>
            <Image src={atendimento} alt="ícone atendimento ágil" />
            <div className={styles.escolherCardText}>
              <h4>Atendimento ágil</h4>
              <p>Suporte rápido e eficiente para atender às necessidades de cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className={styles.unidades}>
        <div className={styles.unidadesTitle}>
          <h2>Nossas Unidades</h2>
          <p>Presença estratégica para atender sua operação.</p>
        </div>
        <div className={styles.unidadesContent}>
          <div className={styles.unidadesCard}>
            <Image src={curitiba} alt="Unidade Curitiba" />
            <div className={styles.unidadesCardText}>
              <p>Rod, BR-116, 15138 - Fanny, 81690-200</p>
              <p>(41) 3569-3191</p>
              <div className={styles.cardIcons}>
                <Link href="https://maps.app.goo.gl/TaNhLqkLpfQFHYZV6" target="_blank">
                  <Image src={address} alt="Endereço" />
                </Link>
                <Link href="https://wa.me/554135693191" target="_blank">
                  <Image src={whatsapp} alt="Whatsapp" />
                </Link>
              </div>
            </div>
            <button className="yellowButton">Curitiba</button>
          </div>
          <div className={styles.unidadesCard}>
            <Image src={colombo} alt="Unidade Colombo" />
            <div className={styles.unidadesCardText}>
              <p>R. Antônio Betinardi, 611 - Guaraituba, 83407-425</p>
              <p>(41) 3606-5101</p>
              <div className={styles.cardIcons}>
                <Link href="https://maps.app.goo.gl/rWtE35kC6qXUky4z6" target="_blank">
                  <Image src={address} alt="Endereço" />
                </Link>
                <Link href="https://wa.me/554136065101" target="_blank">
                  <Image src={whatsapp} alt="Whatsapp" />
                </Link>
              </div>
            </div>
            <button className="yellowButton">Colombo</button>
          </div>
          <div className={styles.unidadesCard}>
            <Image src={pontaGrossa} alt="Unidade Ponta Grossa" />
            <div className={styles.unidadesCardText}>
              <p>Av. Pres. Kennedy, 3295 - Contorno, 84052-465</p>
              <p>(42) 3227-1903</p>
              <div className={styles.cardIcons}>
                <Link href="https://maps.app.goo.gl/qTeYcuagnENrkwyr8" target="_blank">
                  <Image src={address} alt="Endereço" />
                </Link>
                <Link href="https://wa.me/554232271903" target="_blank">
                  <Image src={whatsapp} alt="Whatsapp" />
                </Link>
              </div>
            </div>
            <button className="yellowButton">Ponta Grossa</button>
          </div>
        </div>
      </section>

      <section className={styles.preFooter}>
        
        <Image src={preFooterMobile} alt="Logo" className={styles.preFooterMobile} />
        <Image src={preFooter} alt="Logo" className={styles.preFooterImage} />
        <div className={styles.preFooterText}>
          <h2>Qualidade, agilidade e atendimento especializado para quem não pode parar.</h2>
        </div>
      </section>
    </main>
  );
}
