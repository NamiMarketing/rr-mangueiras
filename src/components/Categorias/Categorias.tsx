"use client";

import styles from "./Categorias.module.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import abracadeiras from "@/img/categorias/abracadeiras-home.png";
import puc from "@/img/categorias/puc.png";
import tubosConexoes from "@/img/categorias/tubos-conexoes.png";
import linhaPneumatica from "@/img/categorias/linha-pneumatica.png";
import linhaHidraulica from "@/img/categorias/linha-hidraulica.png";
import linhaIndustrial from "@/img/categorias/linha-industrial.png";
import linhaAlimenticia from "@/img/categorias/linha-alimenticia.png";
import mangueiras from "@/img/categorias/mangueiras-home.png";
import valvulas from "@/img/categorias/valvulas-home.png";
import engate from "@/img/categorias/engate.png";
import arComprimido from "@/img/categorias/ar-comprimido.png";

const categoriasData = [
  { id: 1, title: "Abraçadeiras", image: abracadeiras },
  { id: 2, title: "PUC", image: puc },
  { id: 3, title: "Tubos e Conexões", image: tubosConexoes },
  { id: 4, title: "Linha Pneumática", image: linhaPneumatica },
  { id: 5, title: "Linha Hidráulica", image: linhaHidraulica },
  { id: 6, title: "Linha Industrial", image: linhaIndustrial },
  { id: 7, title: "Linha Alimentícia", image: linhaAlimenticia },
  { id: 8, title: "Mangueiras", image: mangueiras },
  { id: 9, title: "Válvulas", image: valvulas },
  { id: 10, title: "Engate", image: engate },
  { id: 11, title: "Ar Comprimido", image: arComprimido },
];

export default function Categorias() {
  return (
    <section className={styles.categorias}>
      <h2 className={styles.title}>CATEGORIAS</h2>
      <div className={styles.container}>
        <Swiper
          modules={[Navigation, Scrollbar]}
          spaceBetween={10}
          slidesPerView={6}
          navigation={{
            nextEl: '#categorias-next',
            prevEl: '#categorias-prev'
          }}
          scrollbar={{ draggable: true, el: '#categorias-scrollbar', hide: false }}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 10 },
            576: { slidesPerView: 3, spaceBetween: 15 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 20 },
          }}
          className={styles.swiper}
        >
          {categoriasData.map((c) => (
            <SwiperSlide key={c.id} className={styles.slide}>
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <Image src={c.image} alt={c.title} className={styles.productImage} />
                </div>
                <p className={styles.cardTitle}>{c.title}</p>
              </div>
            </SwiperSlide>
          ))}
          
          <div className={styles.navButtonPrev} id="categorias-prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={styles.navButtonNext} id="categorias-next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Swiper>
        <div id="categorias-scrollbar" className={styles.customScrollbar}></div>
      </div>
      
      <div className={styles.buttonContainer}>
        <Link href="/produtos">
          <button className="yellowButton">VER TODOS OS PRODUTOS</button>
        </Link>
      </div>
    </section>
  );
}
