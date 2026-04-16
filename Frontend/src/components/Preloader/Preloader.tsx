// src/components/Preloader/Preloader.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './preloader.css'; // Import file CSS chứa keyframes
import images from "@/assets/images";
import Image from "next/image";
const Preloader: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Nếu là trang chủ thì ẩn preloader
    if (pathname === '/') {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 600);

    // Dọn dẹp timeout
    return () => clearTimeout(timer);
  }, [pathname]);

  // Nếu không hiển thị thì return null luôn, không tốn tài nguyên render
  if (!isVisible) return null;

  return (
    <div 
      id="body-load" 
      className="fixed inset-0 w-full h-screen bg-[#191B24] flex justify-center items-center z-[1000] animate-body-load"
    >
      <div className="w-full max-w-[800px] flex flex-col gap-8 justify-center items-center text-[3em] leading-[1.4] text-white/20 font-semibold animate-logo-load">
        <Image 
          src={images.logo} 
          alt="RoPhim Logo" 
          width={360} 
          height={100} 
        />
        
        <div className="text-[1.5rem] leading-[1.6] text-white/20 font-semibold text-center max-w-[950px] px-4">
          Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
        </div>
        
      </div>
    </div>
  );
};

export default Preloader;