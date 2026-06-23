import Image from 'next/image';
import Link from 'next/link';
import logoFooter from '../../img/logo.png';
import styles from './Footer.module.css';

interface Unidade {
  nome: string;
  endereco: string;
  telefone: string;
  telHref: string;
  horarios: string[];
  mapQuery: string;
}

const unidades: Unidade[] = [
  {
    nome: 'UNIDADE CURITIBA',
    endereco: 'Rod, BR-116, 15138 - Fanny, 81690-200',
    telefone: '(41) 3569-3191',
    telHref: 'tel:+554135693191',
    horarios: ['Segunda-Sexta: 08:00 - 18:00'],
    mapQuery: 'Rod, BR-116, 15138 - Fanny, Curitiba - PR, 81690-200',
  },
  {
    nome: 'UNIDADE COLOMBO',
    endereco: 'R. Antônio Betinardi, 611 - Guaraituba, 83407-425',
    telefone: '(41) 3606-5101',
    telHref: 'tel:+554136065101',
    horarios: ['Segunda-Sexta: 08:00 - 18:00', 'Sábado: 08:00 - 12:00'],
    mapQuery: 'R. Antônio Betinardi, 611 - Guaraituba, Colombo - PR, 83407-425',
  },
  {
    nome: 'UNIDADE PONTA GROSSA',
    endereco: 'Av. Pres. Kennedy, 3295 - Contorno, 84052-465',
    telefone: '(42) 99932-0319',
    telHref: 'tel:+5542999320319',
    horarios: ['Segunda-Sexta: 08:00 - 18:00'],
    mapQuery: 'Av. Pres. Kennedy, 3295 - Contorno, Ponta Grossa - PR, 84052-465',
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.locationsGrid}>
          {unidades.map((unidade) => (
            <div key={unidade.nome} className={styles.location}>
              <div className={styles.locationInfo}>
                <h3 className={styles.locationTitle}>{unidade.nome}</h3>
                <p className={styles.locationText}>{unidade.endereco}</p>
                <p className={styles.locationText}>
                  <Link href={unidade.telHref}>{unidade.telefone}</Link>
                </p>
                <p className={styles.locationText}>
                  {unidade.horarios.map((horario, i) => (
                    <span key={i}>
                      {horario}
                      {i < unidade.horarios.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              <iframe
                className={styles.locationMap}
                src={`https://www.google.com/maps?q=${encodeURIComponent(unidade.mapQuery)}&z=15&output=embed`}
                title={`Mapa ${unidade.nome}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ))}
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Image src={logoFooter} alt="logo RR Mangueiras" className={styles.logo} />
            </Link>
          </div>

          <div className={styles.socialAndCredits}>
            <Link href="https://namiconsultoria.com.br" target="_blank">
              <p className={styles.credits}>Desenvolvido por Nami Consultoria</p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
