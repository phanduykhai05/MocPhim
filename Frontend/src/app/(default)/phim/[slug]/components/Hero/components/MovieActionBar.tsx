import React from 'react';
import { Play, Heart, Share, MessageCircle } from 'lucide-react';
import { MovieItem } from '@/lib/api/movie';

interface MovieActionBarProps {
  movie: MovieItem;
}

export const MovieActionBar = ({ movie }: MovieActionBarProps) => {
  const rating = movie.tmdb?.vote_average ?? 0;
  const isComing = movie.chieurap === true;
  const hasEpisodes = movie.episodes && movie.episodes.length > 0 && movie.episodes[0]?.server_data?.length > 0;

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
        <a
          href="#episodes"
          onClick={(e) => { e.preventDefault(); document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="relative w-full lg:w-auto flex-shrink-0 flex items-center justify-center gap-3 text-[16px] font-semibold py-3 px-8 border-0 rounded-xl overflow-hidden text-white transition-all duration-300 hover:opacity-95 shadow-[0_8px_26px_rgba(0,0,0,0.28)] cursor-pointer"
          style={{ background: 'linear-gradient(39deg, #e11d48 0%, #f472b6 100%)' }}
        >
          <Play className="w-6 h-6" fill="white" />
          <span>Xem Ngay</span>
        </a>
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

      {/* Action buttons + rating */}
      <div className="flex-grow flex items-center justify-between w-full overflow-x-auto pb-2 lg:pb-0 hide-scrollbar gap-4">
        <div className="flex items-center gap-2 lg:gap-4 flex-nowrap">
          {[
            { name: 'Yêu thích', icon: Heart },
            { name: 'Thêm vào', icon: Play },
            { name: 'Chia sẻ', icon: Share },
            { name: 'Bình luận', icon: MessageCircle },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button key={idx} className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:bg-white/10 p-2.5 rounded-lg transition whitespace-nowrap select-none">
                <Icon size={16} strokeWidth={2} className="text-white/90" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Rating badge */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#3556b6] rounded-full px-3 py-1.5 text-white cursor-pointer select-none">
          <span className="text-yellow-400">★</span>
          <span className="font-bold">{rating > 0 ? rating.toFixed(1) : '0'}</span>
          <span className="text-xs opacity-80 hidden lg:inline">TMDB</span>
        </div>
      </div>
    </div>
  );
};
