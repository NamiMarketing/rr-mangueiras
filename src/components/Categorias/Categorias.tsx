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
import tubosConexoes from "@/img/categorias/tubos-conexoes.png";
import mangueiraAlimenticia from "@/img/categorias/mangueira-alimenticia.png";
import engates from "@/img/categorias/engates-home.png";
import conexoesGalvanizadas from "@/img/categorias/conexoes-galvanizadas.png";
import automotiva from "@/img/categorias/estetica-automotiva.png";

// `slug` casa com o slug da categoria no Sanity — usado para linkar direto
// para /produtos com o filtro já selecionado.
const categoriasData = [
  { id: 1, title: "Abraçadeiras", image: abracadeiras, slug: "abracadeiras" },
  { id: 2, title: "Conexões Galvanizadas e Aço Inox", image: conexoesGalvanizadas, slug: "conexoes-galvanizadas-e-de-aco-inox" },
  { id: 3, title: "Engates", image: engates, slug: "engates" },
  { id: 4, title: "Estética Automotiva", image: automotiva, slug: "estetica-automotiva" },
  { id: 5, title: "Mangueiras Alimentícias e Sanitárias", image: mangueiraAlimenticia, slug: "mangueiras-alimenticias-e-sanitarias" },
  { id: 6, title: "Tubos e Conexões PPR", image: tubosConexoes, slug: "tubos-e-conexoes-ppr" },
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
              <Link href={`/produtos?categoria=${c.slug}`} className={styles.card}>
                <div className={styles.imageContainer}>
                  <Image src={c.image} alt={c.title} className={styles.productImage} />
                </div>
                <p className={styles.cardTitle}>{c.title}</p>
              </Link>
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
