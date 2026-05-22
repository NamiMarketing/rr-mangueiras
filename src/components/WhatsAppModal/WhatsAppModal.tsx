'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './WhatsAppModal.module.css';
import Image from 'next/image';
import whatsappIcon from '@/img/icons/whats.png';

const LOJAS = [
  { nome: 'Curitiba',     whatsapp: 'https://api.whatsapp.com/send?phone=554135693191&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.' },
  { nome: 'Colombo',      whatsapp: 'https://api.whatsapp.com/send?phone=554136065101&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.' },
  { nome: 'Ponta Grossa', whatsapp: 'https://api.whatsapp.com/send?phone=554232271903&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.' },
];

function WhatsAppIcon() {
  return (
    <Image src={whatsappIcon} alt="WhatsApp" width={40} height={40} />
  );
}

interface WhatsAppModalProps {
  children: React.ReactNode;
}

export default function WhatsAppModal({ children }: WhatsAppModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modal = (
    <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Fechar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className={styles.title}>CONTATO</h2>

        <ul className={styles.list}>
          {LOJAS.map((loja) => (
            <li key={loja.nome}>
              <a
                href={loja.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.item}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.icon}><WhatsAppIcon /></span>
                <span className={styles.nome}>{loja.nome}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)} style={{ display: 'contents' }}>
        {children}
      </div>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}
