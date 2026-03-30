"use client";

import styles from "./Testimonials.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.",
    author: "João Oliveira",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.",
    author: "Maria Silva",
  },
  {
    id: 3,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.",
    author: "Carlos Santos",
  },
  {
    id: 4,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.",
    author: "Ana Souza",
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <p>{t.text}</p>
                  <strong>{t.author}</strong>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.navButtonNext} id="testimonials-next">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
