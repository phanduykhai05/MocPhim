import React from 'react';
import HeroSection from '@/app/(home)/components/Hero';
import TopMovies from '@/app/(home)/components/TopMovies';
import BookmarkedMovies from '@/app/(home)/components/BookmarkedMovies';
import WatchedMovies from '@/app/(home)/components/WatchedMovies';
import SeoContent from '@/app/(home)/components/SeoContent';
import Footer from '@/app/(home)/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f0f3f8] dark:bg-[#191B24] font-sans text-gray-900 dark:text-white selection:bg-[#764ba2] selection:text-white transition-colors duration-300">
      {/* Ẩn thẻ H1 cho SEO */}
      <h1 className="sr-only">Xem Phim Online Miễn Phí Vietsub HD - RoPhim 2026</h1>

      <main className="max-w-[1900px] mx-auto 3xl:max-w-[2400px] 4xl:max-w-[3200px]">
        <HeroSection />
        <TopMovies />
        <SeoContent />
      </main>
      <Footer />
    </div>
  );
}