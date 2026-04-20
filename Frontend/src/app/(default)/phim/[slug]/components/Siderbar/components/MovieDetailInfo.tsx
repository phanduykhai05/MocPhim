"use client"; // Thêm dòng này vì chúng ta dùng useState

import React, { useState } from 'react';

export const MovieDetailInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="font-light text-gray-300">
      {/* Thumbnail */}
      <div className="flex flex-col">
  {/* Container bọc ảnh: Tăng từ 120px lên 180px, căn giữa bằng mx-auto */}
  <div className="w-[290px] lg:w-[350px] xl:w-[360px] mx-auto lg:mx-0 mb-6 shrink-0 rounded-2xl overflow-hidden aspect-[2/3] relative bg-[#191b24] shadow-2xl">
    <img 
      src="https://rophims.vip/wp-content/uploads/2026/04/huyen-thoai-aang-tiet-khi-su-cuoi-cung-48635-thumb.jpg" 
      alt="Huyền Thoại Aang" 
      className="absolute inset-0 w-full h-full object-cover select-none"
      loading="lazy" 
    />
  </div>

  {/* Phần chữ: Căn giữa trên mobile (text-center), căn trái trên PC (lg:text-left) */}
  <div className="text-center lg:text-left">
    <h1 className="text-[1.5em] md:text-[1.8em] font-bold text-white mb-2 leading-snug">
      Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng
    </h1>
    <div className="text-gray-400 mb-6 font-normal">
      Avatar: Aang, The Last Airbender
    </div>
  </div>
</div>

      {/* Nút Toggle CHỈ hiện trên Mobile (lg:hidden) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex lg:hidden w-full items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium mb-4 transition"
      >
        <span>{isExpanded ? 'Thu gọn thông tin' : 'Xem thêm thông tin'}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Vùng chi tiết: Ẩn/Hiện trên Mobile dựa vào state, LUÔN HIỆN trên Desktop (lg:block) */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Tags Info */}
        <div className="flex items-center flex-wrap gap-2.5 mb-3">
          <div className="border border-[#f0d25c] text-[#f0d25c] h-6 px-2 rounded text-xs font-medium flex items-center gap-1 cursor-default">
            <span className="text-[10px]">IMDb</span> 0
          </div>
          <div className="bg-white text-black h-6 px-2 rounded text-xs font-bold flex items-center cursor-default">
            HD
          </div>
          <div className="bg-white/10 text-white h-6 px-2 rounded text-xs flex items-center border border-white/10">
            2026
          </div>
          <div className="bg-white/10 text-white h-6 px-2 rounded text-xs flex items-center border border-white/10">
            Full
          </div>
        </div>

        {/* Genre Tags */}
        <div className="flex items-center flex-wrap gap-2.5 mb-3">
          {['Gia Đình', 'Hành Động', 'Phiêu Lưu'].map((genre, idx) => (
            <a key={idx} href="#" className="bg-white/10 hover:bg-white/20 transition text-white h-6 px-2 rounded text-xs flex items-center">
              {genre}
            </a>
          ))}
        </div>

        {/* Status */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-[#22cb4c1a] text-[#22cb4c] px-3 py-2 rounded-full text-xs">
            <i className="fa-solid fa-circle-check"></i>
            <span>Đã hoàn thành: 1</span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-5">
          <div className="text-white font-medium mb-2 block">Giới thiệu:</div>
          <div className="text-sm leading-relaxed text-gray-300">
            <strong>Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng (Avatar: Aang, The Last Airbender)</strong> - Thế giới vừa khôi phục được hòa bình sau nhiều năm chiến tranh, thì loài người lại đối mặt với một nguy cơ mới...
          </div>
        </div>

        {/* Other Details */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-white font-medium whitespace-nowrap">Thời lượng:</span>
            <span>99 Phút</span>
          </div>
          <div className="flex gap-2">
            <span className="text-white font-medium whitespace-nowrap">Năm:</span>
            <span>2026</span>
          </div>
          <div className="flex gap-2">
            <span className="text-white font-medium whitespace-nowrap">Quốc gia:</span>
            <a href="#" className="text-gray-300 hover:text-white transition">Âu Mỹ</a>
          </div>
          <div className="flex gap-2">
            <span className="text-white font-medium whitespace-nowrap">Đạo diễn:</span>
            <a href="#" className="text-gray-300 hover:text-white transition">Lauren Montgomery</a>
          </div>
        </div>
      </div>
    </div>
  );
};