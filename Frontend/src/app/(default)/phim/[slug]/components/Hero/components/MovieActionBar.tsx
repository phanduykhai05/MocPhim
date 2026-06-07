'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Share, MessageCircle } from 'lucide-react';
import { MovieItem } from '@/lib/api/movie';
import BookmarkButton from '@/components/BookmarkButton';
import { apiGetViewCount, apiRecordView } from '@/lib/api/views';

interface MovieActionBarProps {
  movie: MovieItem;
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('vi-VN');
}

export const MovieActionBar = ({ movie }: MovieActionBarProps) => {
  const rating = movie.tmdb?.vote_average ?? 0;
  const isComing = movie.chieurap === true;
  const hasEpisodes = movie.episodes && movie.episodes.length > 0 && movie.episodes[0]?.server_data?.length > 0;

  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    apiGetViewCount(movie.slug).then((data) => {
      if (data) setViewCount(data.viewCount);
    });
    apiRecordView(movie.slug).then((data) => {
      if (data) setViewCount(data.viewCount);
    });
  }, [movie.slug]);

  return (
    <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 justify-between border-b border-white/5">
      {/* Glow effect */}
      <div
        className="absolute top-[-80px] right-0 w-[150px] h-[100px] pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at top right, rgba(254, 207, 89, 0.55) 0%, rgba(255, 241, 204, 0.28) 38%, rgba(255, 241, 204, 0) 72%)'
        }}
      />

      {/* Watch / Trailer button */}
      {isComing ? (
        <a
          href={movie.trailer_url || '#'}
          target={movie.trailer_url ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="relative w-full lg:w-auto flex-shrink-0 flex items-center justify-center gap-3 text-[16px] font-semibold pt-2.5 pb-[calc(0.5rem+22px)] px-6 border-0 rounded-xl overflow-hidden h-auto text-[#0f172a] transition-all duration-300 hover:opacity-95 shadow-[0_8px_26px_rgba(0,0,0,0.28)]"
          style={{ background: 'linear-gradient(39deg, rgba(254, 207, 89, 1) 0%, rgba(255, 241, 204, 1) 100%)' }}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-7 h-7">
            <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path>
          </svg>
          <span className="whitespace-nowrap text-[16px] leading-none text-[#111827]">Xem Trailer</span>
          <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center text-center text-[11px] leading-6 bg-[#f1f1f1] text-black">Phim sắp ra mắt</div>
        </a>
      ) : hasEpisodes ? (
        <Link
          href={`/xem-phim/${movie.slug}`}
          className="relative w-full lg:w-auto flex-shrink-0 flex items-center justify-center gap-3 text-[16px] font-semibold py-3 px-8 border-0 rounded-xl overflow-hidden text-white transition-all duration-300 hover:opacity-95 shadow-[0_8px_26px_rgba(0,0,0,0.28)] cursor-pointer"
          style={{ background: 'linear-gradient(39deg, #e11d48 0%, #f472b6 100%)' }}
        >
          <Play className="w-6 h-6" fill="white" />
          <span>Xem Trên Màn Hình Lớn</span>
        </Link>
      ) : (
        <a
          href={movie.trailer_url || '#'}
          target={movie.trailer_url ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="relative w-full lg:w-auto flex-shrink-0 flex items-center justify-center gap-3 text-[16px] font-semibold py-3 px-8 border-0 rounded-xl text-[#0f172a] transition-all duration-300 hover:opacity-95 shadow-[0_8px_26px_rgba(0,0,0,0.28)]"
          style={{ background: 'linear-gradient(39deg, rgba(254, 207, 89, 1) 0%, rgba(255, 241, 204, 1) 100%)' }}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-6 h-6">
            <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path>
          </svg>
          <span>Xem Trailer</span>
        </a>
      )}

      {/* Action buttons + badges */}
      <div className="flex-grow flex items-center justify-between w-full overflow-x-auto pb-2 lg:pb-0 hide-scrollbar gap-4">
        <div className="flex items-center gap-2 lg:gap-4 flex-nowrap">
          <BookmarkButton movieId={movie._id} slug={movie.slug} />
          {[
            { name: 'Thêm vào', icon: Play },
            { name: 'Chia sẻ', icon: Share },
            { name: 'Bình luận', icon: MessageCircle },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2.5 rounded-lg transition whitespace-nowrap select-none">
                <Icon size={16} strokeWidth={2} className="text-gray-700 dark:text-white/90" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Badges */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* View count */}
          {viewCount !== null && (
            <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-white/10 rounded-full px-3 py-1.5 text-gray-700 dark:text-white/80 text-sm select-none">
              <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 576 512">
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
              </svg>
              <span className="font-medium">{formatViewCount(viewCount)}</span>
            </div>
          )}

          {/* TMDB rating */}
          <div className="flex-shrink-0 flex items-center gap-2 bg-[#3556b6] rounded-full px-3 py-1.5 text-white cursor-pointer select-none">
            <span className="text-yellow-400">★</span>
            <span className="font-bold">{rating > 0 ? rating.toFixed(1) : '0'}</span>
            <span className="text-xs opacity-80 hidden lg:inline">TMDB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
