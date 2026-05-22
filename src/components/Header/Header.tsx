'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoHeader from '../../img/logo.png';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </nav>

        <div className={styles.mobileActions}>
          <button className={styles.searchButton} aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            className={styles.hamburger}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H18.3333M1 7.5H18.3333M10.75 14H18.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className={styles.mobileNav}>
          <Link href="/produtos" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>PRODUTOS</Link>
          <Link href="/contato" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>CONTATO</Link>
          <Link href="/marcas" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>MARCAS</Link>
          <div className={styles.mobileSearchContainer}>
            <input
              type="text"
              placeholder="Buscar..."
              className={styles.mobileSearchInput}
            />
            <button className={styles.searchButton} aria-label="Buscar">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
