import React, { ReactNode } from 'react';

interface TopDetailBannerProps {
  /** Đường dẫn của ảnh poster/cover phim */
  imageUrl: string;
  /** Nội dung hiển thị đè lên trên banner (VD: Tên phim, nút xem phim) */
  children?: ReactNode;
}

export const TopDetailBanner: React.FC<TopDetailBannerProps> = ({ imageUrl, children }) => {
  return (
    <div className="relative w-full h-[800px] bg-[#191b24] overflow-hidden">
      
      {/* 1. Lớp pattern chấm bi mờ phủ toàn màn hình (Thay cho ::before) */}
      <div className="absolute inset-0 bg-[url('/images/dotted.png')] bg-repeat opacity-20 z-[1]" />
      
      {/* 2. Lớp gradient đen làm mượt viền dưới (Thay cho ::after) */}
      <div className="absolute inset-x-0 bottom-0 h-[200px] z-[3] bg-gradient-to-t from-[#191b24] to-transparent" />

      {/* 3. Lớp background mờ ảo (Blur effect) */}
      <div 
        className="absolute inset-0 w-full h-full bg-center bg-cover blur-[50px] opacity-20"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      
      {/* 4. Khung chứa ảnh bìa với Mask-image cắt mờ trên/dưới */}
      <div className="absolute top-0 left-1/2 w-full max-w-[1900px] h-full -translate-x-1/2 
                      [-webkit-mask-image:linear-gradient(to_top,transparent_0,black_20%,black_80%,transparent_100%)] 
                      [mask-image:linear-gradient(to_top,transparent_0,black_20%,black_80%,transparent_100%)]">
        
        {/* 5. Ảnh bìa chính với Mask-image cắt mờ trái/phải */}
        <div 
          className="absolute inset-0 opacity-60 bg-cover bg-center 
                     [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_30%,black_70%,transparent_100%)] 
                     [mask-image:linear-gradient(to_right,transparent_0%,black_30%,black_70%,transparent_100%)]"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      </div>

      {/* 6. Lớp chứa nội dung (Z-index 4 để nổi lên trên cùng) */}
      {children && (
        <div className="relative z-[4] w-full h-full">
          {children}
        </div>
      )}
      
    </div>
  );
};

export default TopDetailBanner;