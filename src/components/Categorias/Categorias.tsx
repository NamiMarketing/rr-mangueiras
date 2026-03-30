"use client";

import styles from "./Categorias.module.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import abracadeiras from "@/img/categorias/abraçadeiras.png";
import adaptadores from "@/img/categorias/adaptadores.png";
import automotiva from "@/img/categorias/automotiva.png";
import conexoes from "@/img/categorias/conexões.png";
import correias from "@/img/categorias/correias.png";
import engates from "@/img/categorias/engates.png";
import filtroY from "@/img/categorias/filtro-y.png";
import lencolBorracha from "@/img/categorias/lencol-borracha.png";
import lubrificacao from "@/img/categorias/lubrificacao.png";
import mangueiras from "@/img/categorias/mangueiras.png";
import manometros from "@/img/categorias/manometros.png";
import registros from "@/img/categorias/registros.png";
import terminais from "@/img/categorias/terminais.png";
import tubosFlexiveis from "@/img/categorias/tubos-flexiveis.png";
import tubos from "@/img/categorias/tubos.png";
import valvulas from "@/img/categorias/valvulas.png";

const categoriasData = [
  { id: 1, title: "Abraçadeiras", image: abracadeiras },
  { id: 2, title: "Adaptadores", image: adaptadores },
  { id: 3, title: "Conexões", image: conexoes },
  { id: 4, title: "Correias", image: correias },
  { id: 5, title: "Engates", image: engates },
  { id: 6, title: "Estética automotiva", image: automotiva },
  { id: 7, title: "Filtro Y", image: filtroY },
  { id: 8, title: "Lençol de borracha", image: lencolBorracha },
  { id: 9, title: "Lubrificação", image: lubrificacao },
  { id: 10, title: "Mangueiras", image: mangueiras },
  { id: 11, title: "Manômetros", image: manometros },
  { id: 12, title: "Registros", image: registros },
  { id: 13, title: "Terminais hidráulicos", image: terminais },
  { id: 14, title: "Tubos", image: tubos },
  { id: 15, title: "Tubos metálicos flexíveis", image: tubosFlexiveis },
  { id: 16, title: "Válvulas", image: valvulas },
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
            320: { slidesPerView: 2, spaceBetween: 10 },
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
          <button className="yellowButton">VER CATÁLOGO COMPLETO</button>
        </Link>
      </div>
    </section>
  );
}
