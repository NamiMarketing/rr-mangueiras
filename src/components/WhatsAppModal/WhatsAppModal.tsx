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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 19.8984L1.40234 14.7891C0.535156 13.2891 0.0820312 11.5898 0.0859375 9.85938C0.0859375 4.42188 4.51172 0 9.94922 0C12.5859 0 15.0625 1.02734 16.9258 2.89062C18.7891 4.75391 19.8125 7.23047 19.8125 9.86719C19.8086 15.3047 15.3828 19.7266 9.94922 19.7266H9.94531C8.29297 19.7266 6.67188 19.3125 5.23047 18.5273L0 19.8984Z" fill="white"/>
      <path d="M9.94922 1.66408C5.42578 1.66408 1.75 5.33986 1.74609 9.85939C1.74609 11.4024 2.18359 12.9141 3.00391 14.2227L3.19922 14.5313L2.37109 17.5547L5.47266 16.7422L5.77344 16.918C7.03125 17.6641 8.47656 18.0586 9.94531 18.0586H9.94922C14.4688 18.0586 18.1445 14.3828 18.1484 9.86329C18.1563 7.68751 17.293 5.60158 15.75 4.06642C14.2148 2.52736 12.125 1.66017 9.94922 1.66408Z" fill="url(#paint0_linear_0_1)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.48438 5.73828C7.30078 5.32812 7.10547 5.32031 6.92969 5.3125L6.45703 5.30859C6.29297 5.30859 6.02734 5.37109 5.80078 5.61719C5.57422 5.86328 4.9375 6.46094 4.9375 7.67188C4.9375 8.88281 5.82031 10.0547 5.94531 10.2188C6.07031 10.3828 7.64844 12.9492 10.1562 13.9375C12.2383 14.7578 12.6602 14.5938 13.1133 14.5547C13.5664 14.5117 14.5703 13.957 14.7773 13.3828C14.9844 12.8086 14.9844 12.3125 14.9219 12.2109C14.8594 12.1094 14.6953 12.0469 14.4492 11.9219C14.2031 11.7969 12.9922 11.2031 12.7656 11.1211C12.5391 11.0391 12.375 10.9961 12.2109 11.2461C12.0469 11.4922 11.5742 12.0469 11.4297 12.2109C11.2852 12.375 11.1406 12.3945 10.8945 12.2734C10.6484 12.1484 9.85547 11.8906 8.91406 11.0508C8.17969 10.3984 7.6875 9.58984 7.54297 9.34375C7.39844 9.09766 7.52734 8.96484 7.65234 8.83984C7.76172 8.73047 7.89844 8.55078 8.02344 8.40625C8.14844 8.26172 8.1875 8.16016 8.26953 7.99609C8.35156 7.83203 8.3125 7.6875 8.25 7.5625C8.17969 7.44531 7.70312 6.22656 7.48438 5.73828Z" fill="white"/>
      <defs>
      <linearGradient id="paint0_linear_0_1" x1="9.90461" y1="2.64888" x2="9.98774" y2="16.661" gradientUnits="userSpaceOnUse">
        <stop stop-color="#57D163"/>
        <stop offset="1" stop-color="#23B33A"/>
      </linearGradient>
      </defs>
    </svg>

  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.0908 12.7022C16.0524 12.4648 15.9036 12.262 15.6807 12.1415L12.3837 10.1989L12.3566 10.1837C12.2183 10.1145 12.0656 10.0791 11.911 10.0802C11.6348 10.0802 11.371 10.1849 11.1879 10.3684L10.2148 11.342C10.1732 11.3815 10.0375 11.4388 9.9963 11.4409C9.98503 11.44 8.86401 11.3592 6.80022 9.29522C4.74011 7.23557 4.65271 6.1111 4.65202 6.1111C4.65317 6.0536 4.70975 5.91836 4.75 5.8765L5.57984 5.04689C5.87217 4.75387 5.9598 4.26811 5.78638 3.89183L3.95374 0.44344C3.82057 0.16928 3.56182 0 3.27478 0C3.07169 0 2.87573 0.08418 2.72255 0.23713L0.460499 2.49412C0.243609 2.70986 0.0568483 3.08706 0.0161383 3.39066C-0.00364173 3.53579 -0.404992 7.00005 4.34451 11.7502C8.37664 15.7819 11.5207 16.0952 12.389 16.0952C12.4947 16.0963 12.6004 16.0909 12.7055 16.0788C13.0081 16.0384 13.3849 15.8521 13.6004 15.6361L15.8606 13.3761C16.0451 13.1907 16.1292 12.9458 16.0908 12.7022Z" fill="#003340"/>
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
