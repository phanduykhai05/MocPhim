import React from 'react';
import SectionHeader from '@/app/(default)/phimmoi/components/HappyMovie/components/SectionHeader';
import MovieHorizontalCard from '@/app/(default)/phimmoi/components/HappyMovie/components/MovieHorizontalCard';
import { MovieHorizontal } from '@/app/(default)/phimmoi/components/HappyMovie/components/types/movie';

// Mock data lấy từ HTML của bạn
const FALLBACK_MOVIES: MovieHorizontal[] = [
  {
    id: '1',
    title: 'Bố Già Trở Lại',
    originalTitle: 'Bố Già Trở Lại',
    slug: 'bo-gia-tro-lai',
    posterUrl: 'https://img.ophim.live/uploads/movies/bo-gia-tro-lai-poster.jpg',
    thumbUrl: 'https://img.ophim.live/uploads/movies/bo-gia-tro-lai-thumb.jpg',
    tags: ['T16', '2026', '1h 35m'],
    badgeStatus: 'Sắp chiếu'
  },
  {
    id: '2',
    title: 'Quái Vật',
    originalTitle: 'Zombie Warfare',
    slug: 'quai-vat',
    posterUrl: 'https://img.ophim.live/uploads/movies/quai-vat-2025-poster.jpg',
    thumbUrl: 'https://img.ophim.live/uploads/movies/quai-vat-2025-thumb.jpg',
    tags: ['T16', 'Phần 1', 'Tập Hoàn tất (20/20)'],
    badgeStatus: 'Full',
    badgeCount: '50'
  },
  {
    id: '3',
    title: 'Đụng Độ Siêu Trăn',
    originalTitle: 'Anaconda',
    slug: 'dung-do-sieu-tran',
    posterUrl: 'https://img.ophim.live/uploads/movies/dung-do-sieu-tran-poster.jpg',
    thumbUrl: 'https://img.ophim.live/uploads/movies/dung-do-sieu-tran-thumb.jpg',
    tags: ['T16', '2025', '0m'],
    badgeStatus: 'P.Đề'
  }
];

interface HappyMovieProps {
  movies?: MovieHorizontal[];
}

export default function MovieTheatersSection({ movies }: HappyMovieProps) {
  const list = movies && movies.length > 0 ? movies : FALLBACK_MOVIES;

  return (
    // fadeIn effect & Container
    <div className="w-full px-5 lg:px-[50px] mx-auto max-w-[1900px] relative animate-[fadeInUp_0.5s_ease-out_forwards]">
      <div className="relative">
        
        <SectionHeader 
          title="Mãn Nhãn với Phim Chiếu Rạp" 
          slug="man-nhan-voi-phim-chieu-rap" 
        />

        <div className="relative group">
          {/* Nút Navigation trái/phải (Sẽ hoạt động nếu gắn JS/Swiper logic) */}
          <button aria-label="Xem trước" className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-full z-20 p-2 text-white opacity-50 hover:opacity-100 hidden lg:block">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>
          <button aria-label="Xem tiếp" className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-full z-20 p-2 text-white opacity-50 hover:opacity-100 hidden lg:block">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>

          {/* Wrapper chứa Cards - Dùng scroll ngang native để hiển thị */}
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory w-full">
            {list.map((movie) => (
              <div key={movie.id} className="snap-start">
                <MovieHorizontalCard movie={movie} />
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}