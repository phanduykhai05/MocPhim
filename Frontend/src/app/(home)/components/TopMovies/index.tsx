import React from 'react';
import MovieList from '@/app/(home)/components/MovieList';
import { topPhimLe, topPhimBo } from '@/app/(home)/components/data/mockData';

export default function TopMovies() {
  return (
    <div className="py-10 bg-[#191B24]">
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