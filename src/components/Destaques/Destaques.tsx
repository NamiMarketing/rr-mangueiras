"use client";

import styles from "./Destaques.module.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import abracadeira from "@/img/destaques/abracadeira.png";
import pneumatica from "@/img/destaques/pneumatica.png";
import galvanizado from "@/img/destaques/galvanizado.png";
import mangueira from "@/img/destaques/mangueira.png";
import engates from "@/img/destaques/engates.png";
import inox from "@/img/destaques/inox.png";
import vonixx from "@/img/destaques/vonixx.png";

const destaquesData = [
  {
    id: 1,
    title: "ABRAÇADEIRAS",
    image: abracadeira,
  },
  {
    id: 2,
    title: "PNEUMÁTICA",
    image: pneumatica,
  },
  {
    id: 3,
    title: "GALVANIZADO",
    image: galvanizado,
  },
  {
    id: 4,
    title: "MANGUEIRIRAS",
    image: mangueira,
  },
  {
    id: 5,
    title: "ENGATES",
    image: engates,
  },
  {
    id: 6,
    title: "INOX",
    image: inox,
  },
  {
    id: 7,
    title: "VONIXX",
    image: vonixx,
  },
];

export default function Destaques() {
  return (
    <section className={styles.destaques}>
      <h2 className={styles.title}>DESTAQUES</h2>
      <div className={styles.container}>
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          draggable={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className={styles.swiper}
        >
          {destaquesData.map((d) => (
            <SwiperSlide key={d.id} className={styles.slide}>
              <div className={styles.card}>
                <Image src={d.image} alt={d.title} className={styles.productImage} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
