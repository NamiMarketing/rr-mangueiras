'use client';

import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import banner from '@/img/banner.png';
import styles from './HeroCarousel.module.css';

// Artes a definir — para adicionar novos banners ao carrossel, basta
// importar a imagem e incluí-la neste array. As bolinhas (paginação)
// são geradas automaticamente pela quantidade de slides.
const slides: StaticImageData[] = [banner];

export default function HeroCarousel() {
  const hasMultiple = slides.length > 1;

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      loop={hasMultiple}
      pagination={{ clickable: true }}
      autoplay={hasMultiple ? { delay: 5000, disableOnInteraction: false } : false}
      className={styles.swiper}
    >
      {slides.map((src, index) => (
        <SwiperSlide key={index} className={styles.slide}>
          <Image
            src={src}
            alt={`Banner ${index + 1}`}
            className={styles.slideImage}
            priority={index === 0}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
