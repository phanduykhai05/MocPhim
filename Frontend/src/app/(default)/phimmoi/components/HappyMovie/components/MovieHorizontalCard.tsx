import React from 'react';
import Link from 'next/link';
import MoviePoster from '@/components/MoviePoster';
import { MovieHorizontal } from '@/app/(default)/phimmoi/components/HappyMovie/components/types/movie'; // Điều chỉnh path phù hợp

interface Props {
  movie: MovieHorizontal;
  priority?: boolean;
}

export default function MovieHorizontalCard({ movie, priority = false }: Props) {
  return (
    <div className="w-full select-none group">
      <div className="relative">
        {/* Cover Poster Hoz */}
        <Link 
          href={`/phim/${movie.slug}`}
          className="block w-full relative h-0 pb-[45%] rounded-lg overflow-hidden bg-gray-800"
        >
          {/* Badge (Ghim trạng thái phim) */}
          {movie.badgeStatus && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-[120px] sm:translate-x-0 z-20 flex items-stretch rounded-t-md overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] text-xs font-bold">
              <div className="bg-red-600 text-white px-2 py-0.5">
                {movie.badgeStatus}
              </div>
              {movie.badgeCount && (
                <div className="bg-gray-900 text-white px-2 py-0.5 border-l border-gray-700">
                  {movie.badgeCount}
                </div>
              )}
            </div>
          )}

          <MoviePoster
            alt={movie.title}
            src={movie.posterUrl}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
            quality={72}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          />
        </Link>

        {/* Nội dung bên dưới cover */}
        <div className="p-4 relative z-10 flex gap-5 items-start">
          {/* Vertical Thumbnail đè lên poster */}
          <div className="w-[80px] shrink-0 -mt-[60px]">
            <Link 
              href={`/phim/${movie.slug}`}
              className="block w-full relative h-0 pb-[150%] rounded-lg overflow-hidden bg-gray-800 shadow-[0_0_10px_5px_rgba(0,0,0,0.1)]"
            >
              <MoviePoster
                alt={movie.title}
                src={movie.thumbUrl}
                sizes="80px"
                quality={65}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Thông tin Text */}
          <div className="flex-1 overflow-hidden mt-2">
            <h4 className="font-medium text-base truncate">
              <Link title={movie.title} href={`/phim/${movie.slug}`} className="text-gray-100 hover:text-pink-400 no-underline transition-colors">
                {movie.title}
              </Link>
            </h4>
            <h4 className="text-sm truncate mb-2">
              <Link title={movie.originalTitle} href={`/phim/${movie.slug}`} className="text-gray-400 hover:text-gray-200 no-underline transition-colors">
                {movie.originalTitle}
              </Link>
            </h4>
            
            <div className="flex flex-wrap items-center gap-2">
              {movie.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`text-sm text-gray-400 ${idx === 0 ? 'font-bold text-gray-300' : ''}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}