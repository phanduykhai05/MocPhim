import React from 'react';
import MovieList from '@/app/(home)/components/MovieList';
import { Movie } from '@/app/(home)/components/types';
import { fetchMovieList, getMovieThumb, MovieListItem } from '@/lib/api/movie';

const mapToHomeMovie = (items: MovieListItem[], cdnImage: string): Movie[] => {
  return items.slice(0, 5).map((movie, index) => ({
    id: movie._id,
    rank: index + 1,
    title: movie.name,
    originalTitle: movie.origin_name,
    year: String(movie.year),
    quality: movie.quality,
    lang: movie.lang,
    image: getMovieThumb(movie.thumb_url, cdnImage),
    link: `/phim/${movie.slug}`,
  }));
};

export default async function TopMovies() {
  const [singleData, seriesData] = await Promise.all([
    fetchMovieList({ list: 'phim-le', sort_field: 'modified_time', sort_type: 'desc' }),
    fetchMovieList({ list: 'phim-bo', sort_field: 'modified_time', sort_type: 'desc' }),
  ]);

  const topPhimLe = singleData ? mapToHomeMovie(singleData.items, singleData.cdnImage) : [];
  const topPhimBo = seriesData ? mapToHomeMovie(seriesData.items, seriesData.cdnImage) : [];

  return (
    <div className="py-10 bg-[#f0f3f8] dark:bg-[#191B24] transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {/* Cột Phim Lẻ */}
        <MovieList
          title="Top Phim Lẻ Mới Nhất"
          icon={<span className="text-[#ff6b35]">🔥</span>} // Có thể thay bằng SVG Icon
          movies={topPhimLe}
          viewAllLink="/phim-le"
          linkColor="text-[#764ba2]"
        />

        {/* Cột Phim Bộ */}
        <MovieList
          title="Top Phim Bộ Mới Nhất"
          icon={<span className="text-[#667eea]">📺</span>} // Có thể thay bằng SVG Icon
          movies={topPhimBo}
          viewAllLink="/phim-bo"
          linkColor="text-[#667eea]"
        />
      </div>
    </div>
  );
}