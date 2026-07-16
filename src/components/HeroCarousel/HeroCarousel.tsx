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
import banner1Mob from '@/img/banner1-mob.png';
import banner2Mob from '@/img/banner2-mob.png';
import banner3Mob from '@/img/banner3-mob.png';
import banner4Mob from '@/img/banner4-mob.png';
import banner5Mob from '@/img/banner5-mob.png';
import banner6Mob from '@/img/banner6-mob.png';
import styles from './HeroCarousel.module.css';

interface Slide {
  desktop: StaticImageData;
  mobile: StaticImageData;
}

// Para adicionar novos banners ao carrossel, basta importar as duas versões
// (desktop e mobile) e incluí-las neste array. As bolinhas (paginação) são
// geradas automaticamente pela quantidade de slides.
const slides: Slide[] = [
  { desktop: banner1, mobile: banner1Mob },
  { desktop: banner2, mobile: banner2Mob },
  { desktop: banner3, mobile: banner3Mob },
  { desktop: banner4, mobile: banner4Mob },
  { desktop: banner5, mobile: banner5Mob },
  { desktop: banner6, mobile: banner6Mob },
];

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
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={styles.slide}>
          <Image
            src={slide.desktop}
            alt={`Banner ${index + 1}`}
            className={`${styles.slideImage} ${styles.slideImageDesktop}`}
            priority={index === 0}
          />
          <Image
            src={slide.mobile}
            alt={`Banner ${index + 1}`}
            className={`${styles.slideImage} ${styles.slideImageMobile}`}
            priority={index === 0}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
