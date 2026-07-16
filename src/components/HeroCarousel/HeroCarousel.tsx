'use client';

import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import banner1 from '@/img/banner1.png';
import banner2 from '@/img/banner2.png';
import banner3 from '@/img/banner3.png';
import banner4 from '@/img/banner4.png';
import banner5 from '@/img/banner5.png';
import banner6 from '@/img/banner6.png';
import styles from './HeroCarousel.module.css';

// Para adicionar novos banners ao carrossel, basta importar a imagem e
// incluí-la neste array. As bolinhas (paginação) são geradas automaticamente
// pela quantidade de slides.
const slides: StaticImageData[] = [banner1, banner2, banner3, banner4, banner5, banner6];

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
