import React from 'react';

export const MovieActionBar = () => {
  return (
    <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 justify-between border-b border-white/5">
      {/* Hiệu ứng Glow góc phải trên (chuyển từ ::before) */}
      <div 
        className="absolute top-[-80px] right-0 w-[150px] h-[100px] bg-no-repeat bg-center bg-contain pointer-events-none z-10"
        style={{
          backgroundImage: "url('https://media-public.canva.com/8uu8E/MAGzUS8uu8E/1/tl.png')",
          filter: "hue-rotate(330deg) saturate(0.6) brightness(1.3)"
        }}
      />

      {/* Nút Xem Ngay */}
      <a href="#" className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center gap-3 text-[18px] font-medium px-8 min-h-[60px] rounded-full text-white transition-all duration-300 hover:opacity-90 shadow-[0_4px_12px_rgba(244,114,182,0.25)] bg-gradient-to-br from-[#d94f8e] to-[#f472b6]">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em">
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
        </svg>
        <span>Xem Ngay</span>
      </a>

      {/* Nhóm tương tác (Yêu thích, Thêm vào, Chia sẻ...) - Cuộn ngang trên mobile */}
      <div className="flex-grow flex items-center justify-between w-full overflow-x-auto pb-2 lg:pb-0 hide-scrollbar gap-4">
        <div className="flex items-center gap-2 lg:gap-4 flex-nowrap">
          {[
            { name: 'Yêu thích', icon: 'M47.6 300.4L228.3 469.1c7.5 7... (Lược SVG để code gọn)' },
            { name: 'Thêm vào', icon: 'M256 80c0-17.7... (Lược SVG)' },
            { name: 'Chia sẻ', icon: 'M16.3628 0.651489... (Lược SVG)' },
            { name: 'Bình luận', icon: 'M14.499 0.5H6... (Lược SVG)' },
          ].map((item, idx) => (
            <button key={idx} className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:bg-white/10 p-2.5 rounded-lg transition whitespace-nowrap select-none">
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div> {/* Thay thế bằng thẻ SVG thật của bạn */}
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Điểm đánh giá */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#3556b6] rounded-full px-3 py-1.5 text-white cursor-pointer select-none">
          <span className="text-yellow-400">★</span>
          <span className="font-bold">0</span>
          <span className="text-xs opacity-80 hidden lg:inline">Đánh giá</span>
        </div>
      </div>
    </div>
  );
};