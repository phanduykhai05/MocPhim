import React from 'react';
import MovieCard from '@/app/(home)/components/MovieCard';
import { Movie } from '@/app/(home)/components/types';

interface MovieListProps {
  title: string;
  icon: React.ReactNode;
  movies: Movie[];
  viewAllLink: string;
  linkColor: string;
}

export default function MovieList({ title, icon, movies, viewAllLink, linkColor }: MovieListProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-white text-[20px] font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="flex flex-col">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <a
        href={viewAllLink}
        className={`inline-flex items-center gap-1 mt-2 text-[13px] hover:underline ${linkColor}`}
      >
        Xem tất cả {title.toLowerCase().replace('top ', '')}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
        </svg>
      </a>
    </div>
  );
}