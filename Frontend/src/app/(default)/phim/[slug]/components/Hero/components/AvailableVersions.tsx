import React from 'react';

export const AvailableVersions = () => {
  return (
    <div className="px-0 lg:px-10 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Các bản chiếu</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
        
        {/* Item Bản chiếu */}
        <a href="#" className="relative flex items-center bg-[#5e6070] text-white rounded-xl overflow-hidden hover:opacity-90 transition">
          {/* Thumbnail có mask-image mờ viền trái */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-[40%] max-w-[130px] z-0"
            style={{
              WebkitMaskImage: 'linear-gradient(270deg, black, transparent 95%)',
              maskImage: 'linear-gradient(270deg, black, transparent 95%)'
            }}
          >
            <img 
              src="https://img.ophim.live/uploads/movies/hanh-trinh-tim-kiem-ky-uc-thumb.jpg" 
              alt="Thumb" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nội dung */}
          <div className="relative z-10 w-[90%] p-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-[10px]">#</span>
              <span>Vietsub #1</span>
            </div>
            <div className="font-semibold text-lg leading-snug m-0">Full</div>
            <button className="bg-white text-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 font-medium">
              Xem bản này
            </button>
          </div>
        </a>

      </div>
    </div>
  );
};