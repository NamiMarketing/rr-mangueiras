'use client';

import Image, { type StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

import logo1 from '@/img/marcas/logo1.png';
import logo2 from '@/img/marcas/logo2.png';
import logo3 from '@/img/marcas/logo3.png';
import logo4 from '@/img/marcas/logo4.png';
import logo5 from '@/img/marcas/logo5.png';
import logo6 from '@/img/marcas/logo6.png';
import logo7 from '@/img/marcas/brasfit.png';
import logo8 from '@/img/marcas/kanaflex.png';

import styles from './MarcasCarousel.module.css';

interface Marca {
  src: StaticImageData;
  alt: string;
}

const marcas: Marca[] = [
  { src: logo6, alt: 'Marca' },
  { src: logo2, alt: 'Marca' },
  { src: logo4, alt: 'Marca' },
  { src: logo1, alt: 'Marca' },
  { src: logo5, alt: 'Marca' },
  { src: logo3, alt: 'Marca' },
  { src: logo7, alt: 'Brasfit' },
  { src: logo8, alt: 'Kanaflex' },
];

export default function MarcasCarousel() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Marcas que trabalhamos</h2>
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView="auto"
        spaceBetween={64}
        loop
        freeMode
        speed={4500}
        allowTouchMove={false}
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
        className={styles.swiper}
      >
        {marcas.map((marca, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <Image src={marca.src} alt={marca.alt} className={styles.logo} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
