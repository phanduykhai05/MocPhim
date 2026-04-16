const Navigation = () => {
  return (
    <nav className="hidden lg:flex items-center gap-6 text-white text-[15px] font-medium">
      <a href="/chu-de" className="hover:text-gray-300 transition-colors capitalize">Chủ Đề</a>
      
      {/* Dropdown Thể loại */}
      <div className="relative group cursor-pointer">
        <div className="flex items-center gap-1 hover:text-gray-300 transition-colors">
          Thể loại
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
        </div>
        {/* Dropdown Menu (Hiển thị khi hover) */}
        <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#1a1c24] border border-gray-800 rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-4 gap-2 z-50 shadow-xl">
          <a href="#" className="text-sm text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded">Hành Động</a>
          <a href="#" className="text-sm text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded">Kinh Dị</a>
          {/* Map thêm các thể loại khác ở đây */}
        </div>
      </div>

      <a href="/phim-le" className="hover:text-gray-300 transition-colors capitalize">Phim Lẻ</a>
      <a href="/phim-bo" className="hover:text-gray-300 transition-colors capitalize">Phim Bộ</a>
      
      {/* Dropdown Quốc gia */}
      <div className="relative group cursor-pointer">
        <div className="flex items-center gap-1 hover:text-gray-300 transition-colors">
          Quốc gia
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
        </div>
        {/* Dropdown Menu */}
        <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#1a1c24] border border-gray-800 rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-4 gap-2 z-50 shadow-xl">
           <a href="#" className="text-sm text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded">Âu Mỹ</a>
           <a href="#" className="text-sm text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded">Hàn Quốc</a>
           {/* Map thêm các quốc gia khác ở đây */}
        </div>
      </div>

      <a href="/dien-vien" className="hover:text-gray-300 transition-colors capitalize">Diễn Viên</a>
      <a href="/lich-chieu" className="hover:text-gray-300 transition-colors capitalize">Lịch Chiếu</a>
    </nav>
  );
};

export default Navigation;