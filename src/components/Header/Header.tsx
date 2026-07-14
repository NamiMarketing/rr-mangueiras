'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoHeader from '../../img/logo.png';
import WhatsAppModal from '../WhatsAppModal/WhatsAppModal';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link href="/quem-somos" className={styles.navLink}>QUEM SOMOS</Link>
            <Link href="/produtos" className={styles.navLink}>PRODUTOS</Link>
            <Link href="/contato" className={styles.navLink}>LOJAS</Link>
            <Link href="/contato" className={styles.navLink}>CONTATO</Link>
            <WhatsAppModal>
              <button className={`yellowButton ${styles.contactButton}`}>Fale conosco</button>
            </WhatsAppModal>
          </nav>

          <div className={styles.mobileActions}>
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
            <Link href="/quem-somos" className={styles.overlayLink} onClick={() => setIsOpen(false)}>QUEM SOMOS</Link>
            <Link href="/produtos" className={styles.overlayLink} onClick={() => setIsOpen(false)}>PRODUTOS</Link>
            <Link href="/contato" className={styles.overlayLink} onClick={() => setIsOpen(false)}>LOJAS</Link>
            <Link href="/contato" className={styles.overlayLink} onClick={() => setIsOpen(false)}>CONTATO</Link>
            <WhatsAppModal>
              <button className={`yellowButton ${styles.contactButton}`} onClick={() => setIsOpen(false)}>Fale conosco</button>
            </WhatsAppModal>
          </nav>
        </div>
      )}
    </>
  );
}
