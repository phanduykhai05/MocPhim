"use client";
import React, { useState, useEffect } from 'react';
import SearchBar from '@/layouts/Header/components/SearchBar';
import Navigation from '@/layouts/Header/components/Navigation';
import UserActions from '@/layouts/Header/components/UserActions';
import Image from "next/image";
import images from "@/assets/images";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Xử lý đổi màu nền header khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'bg-[#191b24] shadow-lg' : 'bg-gradient-to-t from-transparent to-[#191b24]'}`
      }
    >
      <div className="max-w-[1920px] mx-auto w-full px-4 md:px-8 flex items-center gap-4 lg:gap-8 h-[70px] md:h-[90px]">
        
        {/* Mobile Hamburger Menu (Chỉ hiện trên mobile) */}
        <button className="lg:hidden text-white flex flex-col gap-[4px] p-2">
          <span className="block w-5 h-[2px] bg-white"></span>
          <span className="block w-3.5 h-[2px] bg-white"></span>
          <span className="block w-5 h-[2px] bg-white"></span>
        </button>

        {/* Các component đã chia */}
        <Image 
          src={images.logo} 
          alt="MocPhim Logo" 
          width={120} 
          height={40} 
          loading="eager"
          priority
          className="object-contain w-auto h-auto" 
        />
        <SearchBar />
        <Navigation />
        
        <div className="flex-grow hidden lg:block"></div>
        <AnimatedThemeToggler />
        <UserActions />
      </div>
    </header>
  );
};

export default Header;