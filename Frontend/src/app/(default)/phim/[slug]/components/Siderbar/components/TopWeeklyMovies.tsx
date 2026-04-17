import React from 'react';

// Giả lập dữ liệu mảng để map (thực tế bạn sẽ lấy từ API)
const topMovies = [
  { id: 1, title: 'Giải Mã Trọng Án', alias: 'Case X Decoded', ep: 'Tập 3', img: '...' },
  { id: 2, title: 'Mật Ngữ Kỷ', alias: 'The Epoch of Miyu', ep: 'Tập 12', img: '...' },
  // ... các phim khác
];

export const TopWeeklyMovies = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 text-[1.6em] font-semibold text-white mb-4 min-h-[40px]">
        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.88063 16.9893...Z" fill="currentColor"></path>
        </svg>
        <span>Top phim tuần này</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {topMovies.map((movie, index) => (
          <div key={movie.id} className="flex items-center justify-between">
            {/* Vị trí xếp hạng với text-shadow viền trắng */}
            <div className="w-[60px] shrink-0 text-left text-[4em] font-extrabold text-[#191b24] [text-shadow:-1px_0_#fff,0_1px_#fff,1px_0_#fff,0_-1px_#fff]">
              {index + 1}
            </div>

            {/* Thẻ phim */}
            <div className="flex-grow flex items-center gap-4 bg-white/5 rounded-lg overflow-hidden pr-3">
              <a href="#" className="w-[80px] shrink-0 aspect-[2/3] relative bg-gray-800 block">
                <img src={movie.img} alt={movie.title} className="absolute inset-0 w-full h-full object-cover select-none" />
              </a>
              
              <div className="py-2 flex-grow">
                <h4 className="text-white text-[1em] font-normal mb-1 line-clamp-2">
                  <a href="#" className="hover:text-gray-300 transition">{movie.title}</a>
                </h4>
                <div className="text-[0.9em] text-gray-400 opacity-70 mb-2 line-clamp-1">
                  {movie.alias}
                </div>
                
                {/* Thông tin thẻ Tag & Tập phim */}
                <div className="flex items-center text-[0.9em] text-gray-400 gap-2.5">
                  <span className="font-bold text-white">HD</span>
                  {/* Chấm tròn ngăn cách (thay cho pseudo-element ::before) */}
                  <span className="w-[5px] h-[5px] bg-white/30 rounded-full inline-block"></span>
                  <span>{movie.ep}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};