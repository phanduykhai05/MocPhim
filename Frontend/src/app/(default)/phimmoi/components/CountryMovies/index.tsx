"use client";

import React, { memo, useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { SwiperProps } from "swiper/react";
import MoviePoster from "@/components/MoviePoster";

type BadgeType = "pd" | "lt" | "tm";
const BADGE_LABEL: Record<BadgeType, string> = { pd: "PĐ.", tm: "TM.", lt: "LT." };
const BADGE_BG: Record<BadgeType, string> = { pd: "#5e6070", tm: "#2ca35d", lt: "#6366f1" };

export interface CountryMovie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  quality: string;
  lang: string;
  year: number;
  episode_current: string;
  badges: { type: BadgeType; text: string }[];
}

const PLAY_BTN_STYLE: React.CSSProperties = {
  background: 'linear-gradient(39deg, #fecf59, #fff1cc)',
  color: '#1a1a1a',
  boxShadow: '0 5px 10px 5px rgba(255,218,125,0.1)',
  willChange: 'transform',
};

const CountryMovieCard = memo(function CountryMovieCard({
  movie,
  priority,
}: {
  movie: CountryMovie;
  priority?: boolean;
}) {
  return (
    <Link href={`/phim/${movie.slug}`} className="group block no-underline">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1e2030] mb-3">
        <MoviePoster
          src={movie.thumb_url}
          alt={movie.name}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover [will-change:transform] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Single overlay layer — opacity only (cheaper than bg transition) */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 scale-90 group-hover:scale-100 transition-transform duration-200"
            style={PLAY_BTN_STYLE}
          >
            <svg fill="currentColor" viewBox="0 0 384 512" height="22" width="22">
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
          </div>
        </div>

        {movie.badges.length > 0 && (
          <div className="absolute bottom-0 left-2 z-10 flex rounded-t-[4px] overflow-hidden whitespace-nowrap">
            {movie.badges.map((b) => (
              <div
                key={b.type}
                className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] text-white"
                style={{ backgroundColor: BADGE_BG[b.type] }}
              >
                <span style={{ fontWeight: 200 }}>{BADGE_LABEL[b.type]}</span>
                <strong style={{ fontWeight: 200 }}>{b.text}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[13.5px] font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#f472b6] transition-colors leading-snug">
        {movie.name}
      </p>
      <p className="text-[12px] text-gray-500 dark:text-white/45 line-clamp-1 mt-0.5">
        {movie.origin_name}
      </p>
    </Link>
  );
});

const SWIPER_BREAKPOINTS: SwiperProps["breakpoints"] = {
  480:  { slidesPerView: 2 },
  640:  { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1440: { slidesPerView: 5 },
  1920: { slidesPerView: 5 },
};

interface CountryMovieSectionProps {
  id: string;
  title: string;
  titleLine2?: string;
  viewAllLink: string;
  movies: CountryMovie[];
  gradient?: string;
}

export default function CountryMovieSection({
  id,
  title,
  titleLine2,
  viewAllLink,
  movies,
  gradient = "linear-gradient(235deg, rgb(255,255,255) 30%, rgb(255,0,153) 130%)",
}: CountryMovieSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (movies.length === 0) return null;

  const prevId = `country-prev-${id}`;
  const nextId = `country-next-${id}`;
  const titleStyle: React.CSSProperties = { backgroundImage: gradient };

  return (
    <div className="w-full max-w-[1900px] px-4 md:px-[50px] mx-auto mb-10 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[80px] 4xl:px-[120px]">
      <div className="flex gap-8 items-start">

        {/* Left title */}
        <div className="hidden md:flex flex-col gap-3 shrink-0 w-[120px] pt-1">
          <h4 className="text-[25px] font-bold leading-[1.3] m-0 bg-clip-text text-transparent" style={titleStyle}>
            {title}{titleLine2 && <><br />{titleLine2}</>}
          </h4>
          <Link href={viewAllLink} className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-white/50 hover:text-[#f472b6] dark:hover:text-[#f472b6] transition-colors no-underline">
            Xem toàn bộ
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Right carousel */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="flex md:hidden items-center justify-between mb-3">
            <h4 className="text-base font-bold m-0 bg-clip-text text-transparent" style={titleStyle}>
              {title}{titleLine2 ? ` ${titleLine2}` : ""}
            </h4>
            <Link href={viewAllLink} className="text-sm text-gray-500 dark:text-white/50 hover:text-[#f472b6] flex items-center gap-0.5 no-underline">
              Xem toàn bộ
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {!isMounted && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-gray-200 dark:bg-white/5 aspect-video" />
              ))}
            </div>
          )}

          {isMounted && <div className="relative group/slider">
            <button
              id={prevId}
              className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#252836] rounded-full shadow-lg text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              id={nextId}
              className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-4 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#252836] rounded-full shadow-lg text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: `#${prevId}`, nextEl: `#${nextId}` }}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={SWIPER_BREAKPOINTS}
              watchSlidesProgress
            >
              {movies.map((movie, index) => (
                <SwiperSlide key={movie._id}>
                  <CountryMovieCard movie={movie} priority={index < 3} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>}
        </div>
      </div>
    </div>
  );
}
