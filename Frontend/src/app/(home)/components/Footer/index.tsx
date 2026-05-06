import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-4 bg-[#f0f3f8] dark:bg-[#191B24] transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-6 text-[14px]">
        <a href="/hoi-dap" className="text-gray-600 dark:text-[#a0a4b8] hover:text-gray-900 dark:hover:text-white transition-colors">Hỏi-Đáp</a>
        <a href="/chinh-sach-bao-mat" className="text-gray-600 dark:text-[#a0a4b8] hover:text-gray-900 dark:hover:text-white transition-colors">Chính sách bảo mật</a>
        <a href="/dieu-khoan-su-dung" className="text-gray-600 dark:text-[#a0a4b8] hover:text-gray-900 dark:hover:text-white transition-colors">Điều khoản sử dụng</a>
        <a href="/gioi-thieu" className="text-gray-600 dark:text-[#a0a4b8] hover:text-gray-900 dark:hover:text-white transition-colors">Giới thiệu</a>
        <a href="/lien-he" className="text-gray-600 dark:text-[#a0a4b8] hover:text-gray-900 dark:hover:text-white transition-colors">Liên hệ</a>
      </div>
      <div className="text-gray-500 dark:text-[#63677a] text-[13px]">
        © {currentYear} <a href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">RoPhim</a>
      </div>
    </footer>
  );
}