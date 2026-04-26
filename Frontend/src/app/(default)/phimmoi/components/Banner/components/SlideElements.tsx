"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/app/(default)/phimmoi/components/Banner/components/data/movie';
import styles from '../style.module.css';

const FAVORITES_STORAGE_KEY = 'mocphim:favorites';

const SlideElements = ({ movie, priority = false }: { movie: Movie; priority?: boolean }) => {
  const primaryGradient = {
    background: 'rgb(254, 207, 89)',
    backgroundImage: 'linear-gradient(39deg, rgba(254, 207, 89, 1) 0%, rgba(255, 241, 204, 1) 100%)'
  };
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const saved: string[] = raw ? JSON.parse(raw) : [];
      setIsFavorite(saved.includes(movie.slug));
    } catch {
      setIsFavorite(false);
    }
  }, [movie.slug]);

  const handleToggleFavorite = () => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const saved: string[] = raw ? JSON.parse(raw) : [];
      const next = saved.includes(movie.slug)
        ? saved.filter((slug) => slug !== movie.slug)
        : [...saved, movie.slug];

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      setIsFavorite(next.includes(movie.slug));
    } catch {
      // Ignore storage errors in private/restricted environments.
    }
  };

  return (
    <div className="relative w-full h-[560px] md:h-[700px] xl:h-[760px] overflow-hidden">
      <div className={`absolute inset-0 ${styles.bannerBackground}`}>
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="100vw"
          quality={72}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[#191b24]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#191b24]/78 via-[#191b24]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#191b24]/88 via-transparent to-[#191b24]/12"></div>
        <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-[#191b24]/58 to-transparent"></div>
      </div>

      <div className={`mx-auto h-full max-w-[1700px] relative z-10 px-4 md:px-10 xl:px-12 flex items-center ${styles.bannerContent}`}>
        <div className="w-full max-w-[680px] pt-14 md:pt-20">
          <div className="flex-1 text-left">
            <h2 className="text-[2.3rem] leading-tight md:text-[3.9rem] font-extrabold text-white mb-4 drop-shadow-2xl tracking-[-0.02em]">
              {movie.title}
            </h2>
            <h3 className="text-lg md:text-[1.4rem] text-[#f0c96a] font-medium mb-6">
              {movie.alias}
            </h3>

            <div className="flex flex-wrap gap-2.5 mb-4">
              {[movie.year, movie.quality, movie.subtitle, movie.status].map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-[#ffffff12] border border-white/15 rounded-md text-[11px] text-gray-200 font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 mb-7">
              {movie.genres.map(g => (
                <span key={g} className="px-3 py-1 rounded-md bg-[#101726]/85 text-[13px] text-gray-200 border border-white/10 hover:border-[#f7d57f]/60 cursor-pointer transition-colors font-medium">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-100/85 text-sm md:text-[1.1rem] max-w-[620px] line-clamp-2 md:line-clamp-3 mb-10 leading-relaxed font-normal">
              {movie.description}
            </p>

            <div className="flex items-center gap-5">
              <Link
                href={`/xem-phim/${movie.slug}`}
                aria-label={`Xem phim ${movie.title}`}
                style={primaryGradient}
                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_14px_34px_rgba(254,207,89,0.34)]"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 384 512"
                  height="1em"
                  width="1em"
                  className="w-7 h-7 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                </svg>
              </Link>

              <button
                type="button"
                aria-label={isFavorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                aria-pressed={isFavorite}
                onClick={handleToggleFavorite}
                className={`w-12 h-12 rounded-full border backdrop-blur-sm flex items-center justify-center transition-all ${
                  isFavorite
                    ? 'border-[#ff4d6d]/70 bg-[#ff4d6d]/20 text-[#ff8ca3]'
                    : 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>

              <Link
                href={`/phim/${movie.slug}`}
                aria-label={`Xem thông tin phim ${movie.title}`}
                className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideElements;