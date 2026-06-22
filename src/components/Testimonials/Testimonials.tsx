"use client";

import styles from "./Testimonials.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 2,
    text: "Atendimento e proatividade da equipe é algo a ser destacado. Sempre prontos a resolver e ajudar. Parabéns a todo time. Indico com certeza.",
    author: "Cleimar Piveta",
  },
  {
    id: 3,
    text: "Preço justo. Resolvem o problema sem burocracia. Atendimento nota 10",
    author: "Leandro Fernandes",
  },
  {
    id: 4,
    text: "Atendimento sem igual, sempre excelente. E encontro tudo o que preciso.",
    author: "André Rehme",
  },
  {
    id: 5,
    text: "Empresa muito confiável e com materiais de qualidade. Somos grandes parceiros de negócios há alguns anos.",
    author: "Enerpel Teleinformática",
  },
  {
    id: 1,
    text: "Recomendo!! Tem uma variedade enorme de mangueiras e conexões, adaptadores de tudo que é jeito. Local agradável, vendedores atenciosos que não medem esforços para dar uma solução a cada situação. Alguns lugares vendem peças, nessa loja eles vendem soluções. Voltarei muitas vezes.",
    author: "Claudio Pereira",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2>
            O que dizem <br />
            <span>sobre nós</span>
          </h2>
          <div className={styles.paginationContainer} id="testimonials-pagination"></div>
        </div>

        <div className={styles.swiperContainer}>
          <div className={styles.navButtonPrev} id="testimonials-prev">
            <svg width="18" height="34" viewBox="0 0 18 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.0456 2.81208C17.1959 2.65296 17.3135 2.46579 17.3915 2.26124C17.4695 2.05669 17.5065 1.83878 17.5003 1.61994C17.4941 1.4011 17.4449 1.18563 17.3554 0.98582C17.266 0.786011 17.138 0.605779 16.9789 0.455415C16.8198 0.305052 16.6326 0.187501 16.4281 0.109475C16.2235 0.0314495 16.0056 -0.00552391 15.7868 0.00066667C15.5679 0.00685725 15.3525 0.0560903 15.1526 0.145555C14.9528 0.235019 14.7726 0.362963 14.6222 0.522082L0.455571 15.5221C0.16301 15.8315 0 16.2412 0 16.6671C0 17.0929 0.16301 17.5026 0.455571 17.8121L14.6222 32.8138C14.7716 32.9764 14.9518 33.1077 15.1523 33.2C15.3529 33.2924 15.5698 33.344 15.7904 33.3519C16.0111 33.3597 16.2311 33.3236 16.4377 33.2457C16.6443 33.1678 16.8334 33.0496 16.9939 32.898C17.1544 32.7464 17.2832 32.5644 17.3729 32.3627C17.4625 32.1609 17.5111 31.9433 17.5159 31.7225C17.5207 31.5018 17.4816 31.2823 17.4009 31.0768C17.3201 30.8713 17.1994 30.6839 17.0456 30.5254L3.9589 16.6671L17.0456 2.81208Z" fill="#003340"/>
            </svg>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{
              prevEl: "#testimonials-prev",
              nextEl: "#testimonials-next",
            }}
            pagination={{
              el: "#testimonials-pagination",
              clickable: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
            className={styles.swiper}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className={styles.slide}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stars}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <svg key={i} viewBox="0 0 24 24" fill="#F8BB00" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.1 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <svg className={styles.googleLogo} viewBox="0 0 16.8902 17.4926" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avaliação no Google">
                      <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M7.44907 0.0759375C8.35532 -0.0253125 8.89157 -0.0253125 9.86532 0.0759375C11.589 0.331056 13.1868 1.12779 14.4278 2.35094C13.5892 3.14361 12.7616 3.94785 11.9453 4.76344C10.382 3.43844 8.63698 3.1326 6.71032 3.84594C5.29698 4.49594 4.31282 5.54927 3.75782 7.00594C2.85087 6.33073 1.95573 5.63979 1.07282 4.93344C1.01146 4.90114 0.941375 4.88931 0.872815 4.89969C2.27532 2.19552 4.46698 0.587187 7.44782 0.0746875" fill="#F44336" />
                      <path opacity="0.997" fillRule="evenodd" clipRule="evenodd" d="M0.870315 4.89969C0.941148 4.88885 1.00823 4.9001 1.07157 4.93344C1.95448 5.63979 2.84962 6.33073 3.75657 7.00594C3.61385 7.57351 3.52388 8.15306 3.48781 8.73719C3.51865 9.30219 3.60823 9.85677 3.75657 10.4009L0.937815 12.6447C-0.289685 10.0797 -0.312185 7.49802 0.870315 4.89969Z" fill="#FFC107" />
                      <path opacity="0.999" fillRule="evenodd" clipRule="evenodd" d="M14.2941 15.3622C13.4164 14.5882 12.4976 13.8621 11.5416 13.1872C12.4999 12.5105 13.0816 11.5822 13.2866 10.4022H8.59031V7.14094C11.2986 7.11844 14.0057 7.14135 16.7116 7.20969C17.2249 9.99719 16.632 12.5105 14.9328 14.7497C14.7308 14.9645 14.5168 15.1689 14.2941 15.3622Z" fill="#448AFF" />
                      <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M3.75657 10.4022C4.78157 12.9497 6.66073 14.1389 9.39407 13.9697C10.1614 13.8809 10.897 13.6128 11.5416 13.1872C12.4982 13.8639 13.4157 14.5889 14.2941 15.3622C12.9024 16.6128 11.128 17.3548 9.26032 17.4672C8.83599 17.5011 8.40964 17.5011 7.98532 17.4672C4.80365 17.0922 2.45448 15.4847 0.937815 12.6447L3.75657 10.4022Z" fill="#43A047" />
                    </svg>
                  </div>
                  <p>{t.text}</p>
                  <strong>{t.author}</strong>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.navButtonNext} id="testimonials-next">
            <svg width="18" height="34" viewBox="0 0 18 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.470666 30.5407C0.320302 30.6998 0.202753 30.887 0.124727 31.0915C0.046701 31.2961 0.00972681 31.514 0.0159174 31.7328C0.022108 31.9517 0.0713415 32.1672 0.160806 32.367C0.250271 32.5668 0.378214 32.747 0.537333 32.8974C0.696451 33.0477 0.883629 33.1653 1.08818 33.2433C1.29272 33.3213 1.51064 33.3583 1.72947 33.3521C1.94831 33.3459 2.16379 33.2967 2.36359 33.2072C2.5634 33.1178 2.74364 32.9898 2.894 32.8307L17.0607 17.8307C17.3532 17.5213 17.5162 17.1116 17.5162 16.6857C17.5162 16.2598 17.3532 15.8501 17.0607 15.5407L2.894 0.539031C2.74463 0.376429 2.56443 0.245126 2.36389 0.152752C2.16334 0.0603776 1.94644 0.00877298 1.72579 0.000933277C1.50513 -0.00690642 1.28511 0.0291778 1.07852 0.107087C0.871925 0.184996 0.682869 0.303177 0.522335 0.454768C0.3618 0.606359 0.232987 0.788337 0.143376 0.990132C0.0537661 1.19193 0.00514552 1.40952 0.000338087 1.63026C-0.00446934 1.85101 0.0346319 2.0705 0.115372 2.27601C0.196112 2.48151 0.316881 2.66893 0.470663 2.82736L13.5573 16.6857L0.470666 30.5407Z" fill="#003340"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
