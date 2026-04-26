"use client";

import React from "react";
import { NewUpdateCard } from "@/app/(default)/phimmoi/components/MovieUpdate/components/NewUpdateCard";

interface UpdateMovie {
  title: string;
  slug: string;
  thumb: string;
  badge: string;
}

const FALLBACK_MOVIES: UpdateMovie[] = [
  {
    title: "Nữ Luật Sư Lidia Poët (Phần 3)",
    slug: "nu-luat-su-lidia-poet-phan-3",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/nu-luat-su-lidia-poet-phan-3-9502-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Khát Vọng Tình Thân",
    slug: "khat-vong-tinh-than",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/khat-vong-tinh-than-9496-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Ronaldinho: Độc nhất vô nhị",
    slug: "ronaldinho-doc-nhat-vo-nhi",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/ronaldinho-doc-nhat-vo-nhi-9487-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Full Swing: Những Tay Golf Chuyên Nghiệp (Phần 4)",
    slug: "full-swing-nhung-tay-golf-chuyen-nghiep-phan-4",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/full-swing-nhung-tay-golf-chuyen-nghiep-phan-4-9484-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Kẻ Huýt Sáo",
    slug: "ke-huyt-sao",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/ke-huyt-sao-9481-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Hành Trình Của Khỉ Đột – Qua Giọng Kể David Attenborough",
    slug: "hanh-trinh-cua-khi-dot-qua-giong-ke-david-attenborough",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/hanh-trinh-cua-khi-dot-qua-giong-ke-david-attenborough-9478-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "MF GHOST (Phần 2)",
    slug: "mf-ghost-phan-2",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/mf-ghost-phan-2-9475-thumb.webp",
    badge: "Vietsub · Full HD",
  },
  {
    title: "Bất hòa (Phần 2)",
    slug: "bat-hoa-phan-2",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/bat-hoa-phan-2-9472-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "MF GHOST (Phần 3)",
    slug: "mf-ghost-phan-3",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/mf-ghost-phan-3-9469-thumb.webp",
    badge: "Vietsub · Full HD",
  },
  {
    title: "180",
    slug: "180",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/180-9463-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Bạn Cùng Phòng",
    slug: "ban-cung-phong",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/ban-cung-phong-9460-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Vợ Cũ Báo Thù",
    slug: "vo-cu-bao-thu",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/vo-cu-bao-thu-9445-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Bồ Công Anh",
    slug: "bo-cong-anh",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/bo-cong-anh-9435-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Mrithyunjay",
    slug: "mrithyunjay",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/mrithyunjay-9393-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "The Yeti",
    slug: "the-yeti",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/the-yeti-9390-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Tu Yaa Main",
    slug: "tu-yaa-main",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/tu-yaa-main-9387-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Marriage Bites",
    slug: "marriage-bites",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/marriage-bites-9384-thumb.webp",
    badge: "Vietsub · HD",
  },
  {
    title: "Hãy sống cho ngày mai. Hãy chết hôm nay.",
    slug: "hay-song-cho-ngay-mai-hay-chet-hom-nay",
    thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/hay-song-cho-ngay-mai-hay-chet-hom-nay-9375-thumb.webp",
    badge: "Vietsub · HD",
  },
];

interface NewUpdateListProps {
  movies?: UpdateMovie[];
}

export const NewUpdateList = ({ movies }: NewUpdateListProps) => {
  const list = movies && movies.length > 0 ? movies : FALLBACK_MOVIES;

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center mt-[10px] mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0 flex items-center gap-2">
          <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
            <span>Mới Update</span>
            <span className="text-sm font-normal text-white/50 ml-2 flex items-center gap-1">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </h4>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-2">
        {list.map((movie, index) => (
          <NewUpdateCard key={movie.slug} {...movie} priority={index < 4} />
        ))}
      </div>
    </div>
  );
};

export default NewUpdateList;
