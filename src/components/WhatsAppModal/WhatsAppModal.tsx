'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './WhatsAppModal.module.css';

interface Loja {
  nome: string;
  whatsappLabel: string;
  whatsappHref: string;
  telLabel: string;
  telHref: string;
}

const LOJAS: Loja[] = [
  {
    nome: 'Curitiba',
    whatsappLabel: '(41) 3569-3191',
    whatsappHref: 'https://api.whatsapp.com/send?phone=554135693191&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.',
    telLabel: '(41) 3569-3191',
    telHref: 'tel:+554135693191',
  },
  {
    nome: 'Colombo',
    whatsappLabel: '(41) 3606-5101',
    whatsappHref: 'https://api.whatsapp.com/send?phone=554136065101&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.',
    telLabel: '(41) 3606-5101',
    telHref: 'tel:+554136065101',
  },
  {
    nome: 'Ponta Grossa',
    whatsappLabel: '(42) 99932-0319',
    whatsappHref: 'https://api.whatsapp.com/send?phone=5542999320319&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.',
    telLabel: '(42) 3227-1903',
    telHref: 'tel:+554232271903',
  },
];

function WhatsAppIcon() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.25-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.43-4.38-1.18l-.31-.18-3.12.82.83-3.04-.2-.32A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className={styles.title}>CONTATO</h2>

        <div className={styles.list}>
          {LOJAS.map((loja) => (
            <div key={loja.nome} className={styles.unidade}>
              <h3 className={styles.nome}>{loja.nome}</h3>
              <div className={styles.buttons}>
                <a
                  href={loja.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pill}
                  onClick={() => setIsOpen(false)}
                >
                  <WhatsAppIcon />
                  <span>{loja.whatsappLabel}</span>
                </a>
                <a
                  href={loja.telHref}
                  className={styles.pill}
                  onClick={() => setIsOpen(false)}
                >
                  <PhoneIcon />
                  <span>{loja.telLabel}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
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
