"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import styles from "./style.module.css";
import SlideElements from './components/SlideElements';
import { FAKE_MOVIES, type Movie } from './components/data/movie';

interface BannerProps {
  movies?: Movie[];
}

const Banner = ({ movies }: BannerProps) => {
  const slides = movies && movies.length > 0 ? movies : FAKE_MOVIES;

  return (
    <section id="top_slide" className={`w-full bg-[#191b24] relative ${styles.bannerContainer}`}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={true}
        speed={700}
        watchSlidesProgress={true}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-thumb" style="background-image: url('${slides[index]?.poster ?? ""}')"></span>`;
          },
        }}
        className="top-slide-main"
      >
        {slides.map((movie) => (
          <SwiperSlide key={movie.id}>
            <SlideElements movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;