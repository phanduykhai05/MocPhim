import React from 'react';
import { Movie } from '@/app/(home)/components/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <a
      href={movie.link}
      className="flex gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mb-2 text-white no-underline"
    >
      <div className="relative shrink-0 w-[55px] h-[75px] rounded-md overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-0.5 left-0.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-[10px] font-bold px-1.5 py-[1px] rounded">
          {movie.rank}
        </span>
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <div className="font-semibold text-[14px] truncate">{movie.title}</div>
        {movie.originalTitle && (
          <div className="text-[#999] text-[12px] truncate">{movie.originalTitle}</div>
        )}
        <div className="text-[#aaa] text-[11px] mt-1 flex items-center gap-1">
          <span>{movie.year}</span>
          <span>·</span>
          <span>{movie.lang}</span>
          <span>·</span>
          <span>{movie.quality}</span>
        </div>
      </div>
    </a>
  );
}