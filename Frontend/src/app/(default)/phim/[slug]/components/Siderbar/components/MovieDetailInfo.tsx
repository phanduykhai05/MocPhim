"use client";

import React, { useState } from 'react';
import { MovieItem, getMovieThumb } from '@/lib/api/movie';

interface MovieDetailInfoProps {
  movie: MovieItem;
  cdnImage: string;
}

export const MovieDetailInfo = ({ movie, cdnImage }: MovieDetailInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const thumbUrl = getMovieThumb(movie.thumb_url, cdnImage);
  const imdbRating = movie.imdb?.vote_average ?? 0;
  const isCompleted = movie.status === 'completed';

  return (
    <div className="font-light text-gray-700 dark:text-gray-300">
      {/* Thumbnail */}
      <div className="flex flex-col">
        <div className="w-[290px] lg:w-[350px] xl:w-[360px] mx-auto lg:mx-0 mb-6 shrink-0 rounded-2xl overflow-hidden aspect-[2/3] relative bg-gray-300 dark:bg-[#191b24] shadow-2xl">
          <img
            src={thumbUrl}
            alt={movie.name}
            className="absolute inset-0 w-full h-full object-cover select-none"
            loading="lazy"
          />
        </div>

        <div className="text-center lg:text-left">
          <h1 className="text-[1.5em] md:text-[1.8em] font-bold text-gray-900 dark:text-white mb-2 leading-snug">
            {movie.name}
          </h1>
          <div className="text-gray-500 dark:text-gray-400 mb-6 font-normal">
            {movie.origin_name}
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex lg:hidden w-full items-center justify-center gap-2 py-2.5 px-4 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 rounded-lg text-gray-800 dark:text-white text-sm font-medium mb-4 transition"
      >
        <span>{isExpanded ? 'Thu gọn thông tin' : 'Xem thêm thông tin'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Tags row */}
        <div className="flex items-center flex-wrap gap-2.5 mb-3">
          <div className="border border-[#f0d25c] text-[#f0d25c] h-6 px-2 rounded text-xs font-medium flex items-center gap-1 cursor-default">
            <span className="text-[10px]">IMDb</span> {imdbRating}
          </div>
          <div className="bg-white text-black h-6 px-2 rounded text-xs font-bold flex items-center cursor-default">
            {movie.quality || 'HD'}
          </div>
          <div className="bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white h-6 px-2 rounded text-xs flex items-center border border-gray-300 dark:border-white/10">
            {movie.year}
          </div>
          <div className="bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white h-6 px-2 rounded text-xs flex items-center border border-gray-300 dark:border-white/10">
            {movie.episode_current}
          </div>
          {movie.lang && (
            <div className="bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white h-6 px-2 rounded text-xs flex items-center border border-gray-300 dark:border-white/10">
              {movie.lang}
            </div>
          )}
        </div>

        {/* Genre tags */}
        {movie.category && movie.category.length > 0 && (
          <div className="flex items-center flex-wrap gap-2.5 mb-3">
            {movie.category.map((cat) => (
              <a key={cat.id} href={`/the-loai/${cat.slug}`} className="bg-white/10 hover:bg-white/20 transition text-white h-6 px-2 rounded text-xs flex items-center">
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs ${isCompleted ? 'bg-[#22cb4c1a] text-[#22cb4c]' : 'bg-blue-500/10 text-blue-400'}`}>
            <span>{isCompleted ? '✓' : '▶'}</span>
            <span>{movie.episode_current}</span>
          </div>
        </div>

        {/* Overview */}
        {movie.content && (
          <div className="mb-5">
            <div className="text-white font-medium mb-2 block">Giới thiệu:</div>
            <div
              className="text-sm leading-relaxed text-gray-300 line-clamp-6"
              dangerouslySetInnerHTML={{ __html: movie.content }}
            />
          </div>
        )}

        {/* Details */}
        <div className="flex flex-col gap-3 text-sm">
          {movie.time && (
            <div className="flex gap-2">
              <span className="text-white font-medium whitespace-nowrap">Thời lượng:</span>
              <span>{movie.time}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-white font-medium whitespace-nowrap">Năm:</span>
            <span>{movie.year}</span>
          </div>
          {movie.country && movie.country.length > 0 && (
            <div className="flex gap-2">
              <span className="text-white font-medium whitespace-nowrap">Quốc gia:</span>
              <div className="flex flex-wrap gap-1">
                {movie.country.map((c) => (
                  <a key={c.id} href={`/quoc-gia/${c.slug}`} className="text-gray-300 hover:text-white transition">{c.name}</a>
                ))}
              </div>
            </div>
          )}
          {movie.director && movie.director.length > 0 && (
            <div className="flex gap-2">
              <span className="text-white font-medium whitespace-nowrap">Đạo diễn:</span>
              <span className="text-gray-300">{movie.director.join(', ')}</span>
            </div>
          )}
          {movie.episode_total && movie.type !== 'single' && (
            <div className="flex gap-2">
              <span className="text-white font-medium whitespace-nowrap">Tổng số tập:</span>
              <span>{movie.episode_total}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};