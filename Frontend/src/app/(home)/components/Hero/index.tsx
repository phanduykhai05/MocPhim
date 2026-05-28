import React from 'react';
import ArrowBigRightDashIcon from '@/components/icon/arrow-big-right-dash-icon';
import images from '@/assets/images';
import Image from 'next/image';
const HeroSection: React.FC = () => {
  return (
    // section-first: Căn giữa nội dung, thêm màu nền tối để làm nổi bật hiệu ứng kính mờ
    <div 
      id="section-first" 
      className="flex justify-center items-center min-h-screen bg-[#f0f3f8] dark:bg-[#191B24] transition-colors duration-300"
    >
      {/* Container: Giới hạn chiều rộng theo code gốc (max-width: 1120px) */}
      <div className="container mx-auto px-5 w-full max-w-[1120px]">
        
        {/* Home Board: Khối bo góc chứa hiệu ứng Glassmorphism */}
        <div className="flex flex-col items-center justify-center gap-12 w-full px-8 py-16 md:px-32 md:py-24 my-20 mx-auto rounded-[2rem] bg-white/[0.025] backdrop-blur-[20px]">
          
          {/* Logo */}
          <a href="/phimmoi" className="block cursor-pointer">
            <Image 
              src={images.logo}
              alt="RoPhim - Xem phim online miễn phí" 
              width={200} 
              height={60} 
              className="w-auto h-auto"
              style={{ width: "auto", height: "auto" }}
              decoding="async" 
            />
          </a>

          {/* Heading */}
          <h2 className="text-gray-900 dark:text-white text-center text-[18px] md:text-[2.6em] font-semibold leading-[1.5] mb-4">
            Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
          </h2>

          {/* Buttons Group */}
          <div>
            <a 
              href="/phimmoi" 
              className="inline-flex items-center justify-center min-h-[60px] px-8 py-4 rounded-full text-[18px] font-medium text-black bg-gradient-to-tr from-[#fecf59] to-[#fff1cc] shadow-[0_5px_10px_5px_rgba(255,218,125,0.1)] scale-110 transition-all duration-300 hover:scale-[1.15]"
            >
              <div className="inline-flex items-center gap-4 px-2">
                <strong className="font-bold">Xem Ngay</strong>
                
                {/* Icon mũi tên (Cần import FontAwesome trong _document.tsx hoặc layout.tsx) */}
                <i className="fa-solid fa-arrow-right text-[0.9em]"><ArrowBigRightDashIcon /></i>
                
                {/* Lưu ý: Nếu không muốn dùng FontAwesome, bạn có thể comment thẻ <i> ở trên và uncomment thẻ SVG bên dưới */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg> 
                */}
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;