"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import styles from "./style.module.css";
import SlideElements from './components/SlideElements';
import { FAKE_MOVIES } from './components/data/movie';

const Banner = () => {
  return (
    <section id="top_slide" className={`w-full bg-[#0a0a0a] relative ${styles.bannerContainer}`}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={true}
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            // Class custom-thumb sẽ được gán trực tiếp vào đây
            return `<span class="${className} custom-thumb" style="background-image: url('${FAKE_MOVIES[index].poster}')"></span>`;
          },
        }}
        className="top-slide-main"
      >
        {FAKE_MOVIES.map((movie) => (
          <SwiperSlide key={movie.id}>
            <SlideElements movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;