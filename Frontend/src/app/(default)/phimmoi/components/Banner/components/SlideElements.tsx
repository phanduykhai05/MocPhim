import React from 'react';
import { Movie } from '@/app/(default)/phimmoi/components/Banner/components/data/movie';

const SlideElements = ({ movie }: { movie: Movie }) => {
  // Định nghĩa màu gradient chuẩn từ yêu cầu của bạn
  const primaryGradient = {
    background: 'rgb(254, 207, 89)',
    backgroundImage: 'linear-gradient(39deg, rgba(254, 207, 89, 1) 0%, rgba(255, 241, 204, 1) 100%)'
  };

  return (
    <div className="relative w-full h-[550px] md:h-[700px] -mb-20 overflow-hidden">
      {/* Background Fade */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto h-full relative z-10 px-4 md:px-12 flex items-center">
        <div className="flex flex-col md:flex-row items-center gap-12 w-full">
          {/* Poster Image - Giữ nguyên shadow và border kiểu SaaS */}
          <div className="poster-box hidden md:block w-[260px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-2xl">
              {movie.title}
            </h2>
            <h3 className="text-lg md:text-xl text-[#fecf59] font-medium mb-6 uppercase tracking-[3px]">
              {movie.alias}
            </h3>

            {/* Tags Classic */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[movie.year, movie.quality, movie.subtitle, movie.status].map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-sm text-[10px] md:text-[11px] text-gray-200 font-bold uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-4 mb-6">
              {movie.genres.map(g => (
                <span key={g} className="text-[15px] text-gray-400 hover:text-[#fecf59] cursor-pointer transition-colors font-medium">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300/90 text-sm md:text-base max-w-xl line-clamp-3 mb-10 leading-relaxed font-light">
              {movie.description}
            </p>

            {/* Buttons Group */}
            <div className="flex items-center gap-5">
              {/* Nút Play với màu Gradient của bạn */}
              {/* Nút Play với màu Gradient */}
                <button 
                style={primaryGradient}
                className="w-16 h-16 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(254,207,89,0.3)]"
                >
                <svg 
                    stroke="currentColor" 
                    fill="currentColor" 
                    strokeWidth="0"   /* Sửa chỗ này từ stroke-width thành strokeWidth */
                    viewBox="0 0 384 512" 
                    height="1em" 
                    width="1em" 
                    className="w-7 h-7 ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                </svg>
                </button>

              {/* Nút Wishlist */}
              <button className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>

              {/* Nút Info */}
              <button className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideElements;