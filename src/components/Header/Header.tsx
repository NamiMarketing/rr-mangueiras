import Image from 'next/image';
import Link from 'next/link';
import logoHeader from '../../img/logo.png';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image 
              src={logoHeader} 
              alt="logo RR Mangueiras" 
              className={styles.logo}
              priority
            />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/produtos" className={styles.navLink}>PRODUTOS</Link>
          <Link href="/contato" className={styles.navLink}>CONTATO</Link>
          <Link href="/marcas" className={styles.navLink}>MARCAS</Link>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="" 
              className={styles.searchInput}
            />
            <button className={styles.searchButton} aria-label="Buscar">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </nav>

      </div>
    </header>
  );
}
