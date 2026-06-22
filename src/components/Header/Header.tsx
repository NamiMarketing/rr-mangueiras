'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoHeader from '../../img/logo.png';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const term = searchValue.trim();
    if (term) {
      router.push(`/produtos?q=${encodeURIComponent(term)}`);
    } else {
      router.push('/produtos');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
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
            <Link href="/quem-somos" className={styles.navLink}>QUEM SOMOS</Link>
            <Link href="/contato" className={styles.navLink}>CONTATO</Link>
            <Link href="/marcas" className={styles.navLink}>MARCAS</Link>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder=""
                className={styles.searchInput}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.searchButton} aria-label="Buscar" onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </nav>

          <div className={styles.mobileActions}>
            <button className={styles.mobileIconButton} aria-label="Buscar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button
              className={styles.mobileIconButton}
              onClick={() => setIsOpen(true)}
              aria-label="Abrir menu"
            >
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H18.3333M1 7.5H18.3333M10.75 14H18.3333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayTop}>
            <div className={styles.overlayLogo}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src={logoHeader}
                  alt="logo RR Mangueiras"
                  className={styles.logo}
                  priority
                />
              </Link>
            </div>
            <button
              className={styles.mobileIconButton}
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className={styles.overlayNav}>
            <Link href="/produtos" className={styles.overlayLink} onClick={() => setIsOpen(false)}>PRODUTOS</Link>
            <Link href="/quem-somos" className={styles.overlayLink} onClick={() => setIsOpen(false)}>QUEM SOMOS</Link>
            <Link href="/contato" className={styles.overlayLink} onClick={() => setIsOpen(false)}>CONTATO</Link>
            {/* <Link href="/marcas" className={styles.overlayLink} onClick={() => setIsOpen(false)}>MARCAS</Link> */}
          </nav>

          <div className={styles.overlayBottom}>
            <a href="https://www.instagram.com/rrmangueiras_aboficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="25" fill="white"/>
                  <path d="M25.0015 20.7502C23.8743 20.7502 22.7933 21.1979 21.9963 21.995C21.1992 22.792 20.7515 23.873 20.7515 25.0002C20.7515 26.1273 21.1992 27.2083 21.9963 28.0054C22.7933 28.8024 23.8743 29.2502 25.0015 29.2502C26.1286 29.2502 27.2096 28.8024 28.0067 28.0054C28.8037 27.2083 29.2515 26.1273 29.2515 25.0002C29.2515 23.873 28.8037 22.792 28.0067 21.995C27.2096 21.1979 26.1286 20.7502 25.0015 20.7502ZM25.0015 17.9168C26.8801 17.9168 28.6817 18.6631 30.0101 19.9915C31.3385 21.3199 32.0848 23.1215 32.0848 25.0002C32.0848 26.8788 31.3385 28.6805 30.0101 30.0088C28.6817 31.3372 26.8801 32.0835 25.0015 32.0835C23.1228 32.0835 21.3212 31.3372 19.9928 30.0088C18.6644 28.6805 17.9181 26.8788 17.9181 25.0002C17.9181 23.1215 18.6644 21.3199 19.9928 19.9915C21.3212 18.6631 23.1228 17.9168 25.0015 17.9168ZM34.2098 17.5627C34.2098 18.0323 34.0232 18.4827 33.6911 18.8148C33.359 19.1469 32.9086 19.3335 32.439 19.3335C31.9693 19.3335 31.5189 19.1469 31.1868 18.8148C30.8547 18.4827 30.6681 18.0323 30.6681 17.5627C30.6681 17.093 30.8547 16.6426 31.1868 16.3105C31.5189 15.9784 31.9693 15.7918 32.439 15.7918C32.9086 15.7918 33.359 15.9784 33.6911 16.3105C34.0232 16.6426 34.2098 17.093 34.2098 17.5627ZM25.0015 13.6668C21.4966 13.6668 20.9243 13.6767 19.2937 13.749C18.183 13.8014 17.4379 13.9502 16.7465 14.2193C16.1683 14.4324 15.6454 14.7727 15.2165 15.2152C14.7735 15.644 14.4326 16.1669 14.2192 16.7452C13.95 17.4394 13.8013 18.1832 13.7503 19.2924C13.6766 20.8564 13.6667 21.4032 13.6667 25.0002C13.6667 28.5064 13.6766 29.0773 13.7489 30.7079C13.8013 31.8172 13.95 32.5637 14.2178 33.2537C14.4586 33.8699 14.742 34.3133 15.2123 34.7837C15.6897 35.2597 16.1331 35.5444 16.7423 35.7796C17.4421 36.0502 18.1873 36.2003 19.2923 36.2513C20.8563 36.325 21.4031 36.3335 25 36.3335C28.5063 36.3335 29.0772 36.3236 30.7078 36.2513C31.8156 36.1989 32.5608 36.0502 33.2535 35.7824C33.8318 35.5694 34.3547 35.229 34.7835 34.7865C35.261 34.3105 35.5457 33.8671 35.7809 33.2565C36.05 32.5595 36.2002 31.8143 36.2512 30.7065C36.3249 29.1439 36.3334 28.5957 36.3334 25.0002C36.3334 21.4953 36.3235 20.923 36.2512 19.2924C36.1988 18.1846 36.0486 17.4366 35.7809 16.7452C35.5679 16.167 35.2275 15.6441 34.785 15.2152C34.3562 14.7722 33.8333 14.4314 33.255 14.2179C32.5608 13.9487 31.8156 13.8 30.7078 13.749C29.1452 13.6753 28.5984 13.6668 25 13.6668M25 10.8335C28.8491 10.8335 29.3294 10.8477 30.841 10.9185C32.3483 10.9893 33.3768 11.2259 34.2792 11.5772C35.2142 11.9371 36.0019 12.4244 36.7895 13.2107C37.5102 13.9186 38.0676 14.7753 38.423 15.721C38.7729 16.6234 39.0109 17.6519 39.0817 19.1607C39.1483 20.6708 39.1667 21.1511 39.1667 25.0002C39.1667 28.8492 39.1525 29.3295 39.0817 30.8397C39.0109 32.3498 38.7729 33.3755 38.423 34.2793C38.0676 35.225 37.5102 36.0817 36.7895 36.7897C36.0816 37.5103 35.2249 38.0678 34.2792 38.4231C33.3768 38.773 32.3483 39.011 30.841 39.0818C29.3294 39.1484 28.8491 39.1668 25 39.1668C21.151 39.1668 20.6707 39.1527 19.1591 39.0818C17.6518 39.011 16.6247 38.773 15.7209 38.4231C14.7752 38.0678 13.9185 37.5103 13.2105 36.7897C12.4899 36.0817 11.9324 35.225 11.5771 34.2793C11.2258 33.3769 10.9892 32.3484 10.9184 30.8397C10.8504 29.3295 10.8334 28.8492 10.8334 25.0002C10.8334 21.1511 10.8475 20.6708 10.9184 19.1607C10.9892 17.6505 11.2258 16.6248 11.5771 15.721C11.9324 14.7753 12.4899 13.9186 13.2105 13.2107C13.9185 12.49 14.7752 11.9326 15.7209 11.5772C16.6233 11.2259 17.6504 10.9893 19.1591 10.9185C20.6721 10.8519 21.1524 10.8335 25.0015 10.8335" fill="#003340"/>
                </svg>
              </a>
          </div>
        </div>
      )}
    </>
  );
}
