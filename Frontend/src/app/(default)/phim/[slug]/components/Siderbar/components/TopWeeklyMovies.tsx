import React from 'react';
import Link from 'next/link';
import { MovieListItem, getMovieThumb } from '@/lib/api/movie';

interface TopWeeklyMoviesProps {
  movies: MovieListItem[];
  cdnImage: string;
}

export const TopWeeklyMovies = ({ movies, cdnImage }: TopWeeklyMoviesProps) => {
  const list = movies.slice(0, 10);
  if (list.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 text-[1.6em] font-semibold text-gray-900 dark:text-white mb-4 min-h-[40px]">
        <svg className="w-6 h-6 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.88063 16.9893C2.28961 17.3325 2.7898 17.5 3.2807 17.5C3.86474 17.5 4.44572 17.2709 4.87573 16.8233L7.25 14.3318L9.62427 16.8233C10.0543 17.2709 10.6353 17.5 11.2193 17.5C11.7102 17.5 12.2104 17.3325 12.6194 16.9893C12.7785 16.8518 12.9155 16.6991 13.0315 16.5358L17.6429 11.5H18.75V13.25C18.75 13.6642 19.0858 14 19.5 14H22.5C22.9142 14 23.25 13.6642 23.25 13.25V8.75C23.25 8.33579 22.9142 8 22.5 8H19.5C19.0858 8 18.75 8.33579 18.75 8.75V10.25H17.25C17.25 10.25 17.25 10.25 17.25 10.25L12.0189 4.57576C11.1487 3.63782 9.67046 3.58208 8.73252 4.45226C8.57339 4.60139 8.43637 4.76929 8.32241 4.94989L4.23804 9.44073L4.14645 9.34835C3.5607 8.76256 2.6893 8.62988 1.96465 8.94927C1.24 9.26866 0.75 9.98062 0.75 10.773V14.727C0.75 15.5194 1.24 16.2313 1.96465 16.5507C1.96465 16.5507 1.88063 16.9893 1.88063 16.9893Z" fill="currentColor"/>
        </svg>
        <span>Top phim tuần này</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {list.map((movie, index) => {
          const thumb = getMovieThumb(movie.thumb_url, cdnImage);
          return (
            <div key={movie._id} className="flex items-center justify-between">
              <div className="w-[60px] shrink-0 text-left text-[4em] font-extrabold text-[#191b24] [text-shadow:-1px_0_#fff,0_1px_#fff,1px_0_#fff,0_-1px_#fff]">
                {index + 1}
              </div>

              <div className="flex-grow flex items-center gap-4 bg-white/5 rounded-lg overflow-hidden pr-3">
                <Link href={`/phim/${movie.slug}`} className="w-[80px] shrink-0 aspect-[2/3] relative bg-gray-800 block">
                  <img
                    src={thumb}
                    alt={movie.name}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </Link>

                <div className="py-2 flex-grow">
                  <h4 className="text-gray-900 dark:text-white text-[1em] font-normal mb-1 line-clamp-2">
                    <Link href={`/phim/${movie.slug}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition">{movie.name}</Link>
                  </h4>
                  <div className="text-[0.9em] text-gray-500 dark:text-gray-400 opacity-70 mb-2 line-clamp-1">
                    {movie.origin_name}
                  </div>
                  <div className="flex items-center text-[0.9em] text-gray-500 dark:text-gray-400 gap-2.5">
                    <span className="font-bold text-gray-800 dark:text-white">{movie.quality || 'HD'}</span>
                    <span className="w-[5px] h-[5px] bg-gray-400 dark:bg-white/30 rounded-full inline-block"></span>
                    <span>{movie.episode_current}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};