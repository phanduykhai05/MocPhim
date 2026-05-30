"use client";
import React, { useState, useEffect } from 'react';
import MobileMenu from '@/layouts/Header/components/MobileMenu';
import SearchBar from '@/layouts/Header/components/SearchBar';
import Navigation from '@/layouts/Header/components/Navigation';
import UserActions from '@/layouts/Header/components/UserActions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import images from "@/assets/images";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto w-full px-4 md:px-8 3xl:px-16 4xl:px-24 flex items-center gap-4 lg:gap-8 h-[70px] md:h-[90px] 3xl:h-[100px]">
        {/* Mobile Hamburger Menu (Chỉ hiện trên mobile) */}
        <button
          className="lg:hidden text-white flex flex-col gap-[4px] p-2"
          aria-label="Mở menu danh mục"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="block w-5 h-[2px] bg-white"></span>
          <span className="block w-3.5 h-[2px] bg-white"></span>
          <span className="block w-5 h-[2px] bg-white"></span>
        </button>

        {/* Các component đã chia */}
        <Link
          href="/phimmoi"
          aria-label="Về trang phim mới"
          className="shrink-0"
          onClick={(e) => {
            if (pathname === '/phimmoi') {
              e.preventDefault();
              window.location.reload();
            }
          }}
        >
          <span className="relative inline-block overflow-hidden rounded-sm">
            <Image
              src={images.logo}
              alt="MocPhim Logo"
              width={120}
              height={40}
              loading="eager"
              priority
              className="object-contain"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full animate-logo-shine bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </span>
        </Link>
        <SearchBar />
        <Navigation />
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        
        <div className="flex-grow hidden lg:block"></div>
        <AnimatedThemeToggler className="text-gray-700 dark:text-white cursor-pointer hover:opacity-70 transition-opacity w-5 h-5" />
        <UserActions />
      </div>
    </header>
  );
};

export default Header;