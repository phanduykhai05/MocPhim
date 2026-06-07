import React from 'react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu truyền vào component để tái sử dụng
export interface MovieSlideProps {
  title: string;
  originalTitle: string;
  slug: string;
  imageUrl: string;
  year: string;
  quality: string;
  language: string;
  status: string;
  genres: { name: string; slug: string }[];
  description: string;
}

const HeroSlide: React.FC<MovieSlideProps> = ({
  title,
  originalTitle,
  slug,
  imageUrl,
  year,
  quality,
  language,
  status,
  genres,
  description,
}) => {
  const movieUrl = `/phim/${slug}`;

  return (
    // Swiper slide container - Swiper sẽ tự động thêm các class/style cần thiết khi chạy
    <div className="swiper-slide w-full h-full relative block">
      <div className="absolute inset-0 w-full h-full bg-[#0f1115] overflow-hidden">
        
        {/* Link bao phủ toàn bộ slide - dành cho những ai click ra vùng trống */}
        <Link href={movieUrl} className="absolute inset-0 z-30 block" aria-label={title}></Link>

        {/* Lớp nền mờ phía sau (Background Fade) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>

        {/* Lớp hình ảnh chính có hiệu ứng Mask (Cover Fade) */}
        <div 
          className="absolute top-0 left-1/2 w-full max-w-[1900px] h-[calc(100%-60px)] -translate-x-1/2 pointer-events-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, transparent 0, black 20%, black 80%, transparent 100%)',
            maskImage: 'linear-gradient(to top, transparent 0, black 20%, black 80%, transparent 100%)'
          }}
        >
          <div 
            className="relative w-full h-full block"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 10px, rgba(0, 0, 0, .2) 15%, black 40%, black 80%, transparent 99%)',
              maskImage: 'linear-gradient(to right, transparent 10px, rgba(0, 0, 0, .2) 15%, black 40%, black 80%, transparent 99%)'
            }}
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500" 
              src={imageUrl} 
              alt={title} 
              loading="lazy" 
              decoding="async" 
            />
          </div>
        </div>

        {/* Vùng chứa nội dung chữ và nút bấm (Safe Area) */}
        <div className="absolute inset-0 z-40 flex items-center px-4 md:px-12 xl:px-24 max-w-[1900px] mx-auto pointer-events-none">
          <div className="w-full max-w-2xl relative pointer-events-auto">
            
            {/* Tên Phim */}
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
              <Link href={movieUrl} className="hover:text-blue-500 transition-colors">
                {title}
              </Link>
            </h3>
            
            {/* Tên Gốc */}
            <h3 className="text-lg md:text-xl text-white/50 font-medium mb-4">
              <Link href={movieUrl} className="hover:text-white/80 transition-colors">
                {originalTitle}
              </Link>
            </h3>

            {/* Thẻ meta (Năm, Chất lượng, Vietsub, Trạng thái) */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {[year, quality, language, status].map((tag, index) => (
                <div key={index} className="px-2 py-1 bg-white/10 rounded text-white text-xs font-semibold tracking-wider">
                  {tag}
                </div>
              ))}
            </div>

            {/* Thẻ Thể loại */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium text-blue-400">
              {genres.map((genre) => (
                <Link key={genre.slug} href={`/the-loai/${genre.slug}`} className="hover:text-blue-300 transition-colors relative z-40">
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Mô tả phim */}
            <div className="text-white/70 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
              {description}
            </div>

            {/* Nhóm nút tương tác */}
            <div className="flex items-center gap-3 relative z-40">
              {/* Nút Play */}
              <Link 
                href={movieUrl}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/30"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                </svg>
              </Link>

              {/* Cụm nút phụ (Yêu thích, Chi tiết) */}
              <div className="flex items-center gap-2">
                <button 
                  aria-label="Thêm vào danh sách yêu thích" 
                  className="flex items-center justify-center w-10 h-10 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path>
                  </svg>
                </button>
                <Link 
                  href={movieUrl}
                  className="flex items-center justify-center w-10 h-10 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;