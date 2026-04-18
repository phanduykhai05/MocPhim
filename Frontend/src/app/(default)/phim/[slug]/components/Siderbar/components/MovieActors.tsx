import React from 'react';

export const MovieActors = () => {
  // Dữ liệu diễn viên mẫu từ HTML của bạn
  const actors = [
    {
      name: 'Guy Pearce',
      url: '/dien-vien/guy-pearce',
      image: 'https://image.tmdb.org/t/p/w500/vTqk6Nh3WgqPubkS23eOlMAwmwa.jpg'
    },
    {
      name: 'Carrie-Anne Moss',
      url: '/dien-vien/carrie-anne-moss',
      image: 'https://image.tmdb.org/t/p/w500/gc7JwuLDD0kXHUlGx5vWzdlqSIT.jpg'
    },
    {
      name: 'Joe Pantoliano',
      url: '/dien-vien/joe-pantoliano',
      image: 'https://image.tmdb.org/t/p/w500/3OHUI3nX4SYGGItDk3xqeIvWtIf.jpg'
    }
  ];

  return (
    <div className="mt-8">
      {/* Header "Diễn viên" */}
      <h3 className="text-[1.6em] font-semibold text-white mb-4 flex items-center gap-4 min-h-[40px]">
        Diễn viên
      </h3>

      {/* Danh sách diễn viên (Grid 3 cột) */}
      <div className="grid grid-cols-3 gap-x-2.5 gap-y-6">
        {actors.map((actor, index) => (
          <div key={index} className="flex flex-col items-center text-center gap-3">
            
            {/* Ảnh Avatar tròn 80px */}
            <a 
              href={actor.url} 
              className="w-[80px] h-[80px] rounded-full overflow-hidden relative bg-[#191b24] flex-shrink-0 block hover:opacity-80 transition-opacity"
            >
              <img 
                loading="lazy" 
                alt={actor.name} 
                src={actor.image} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </a>

            {/* Tên diễn viên (line-clamp-2 để cắt chữ nếu quá dài giống class lim-2) */}
            <div className="w-full">
              <h4 className="mb-1 text-sm font-medium text-white/90 hover:text-[#f472b6] transition-colors line-clamp-2 leading-tight">
                <a href={actor.url}>{actor.name}</a>
              </h4>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};