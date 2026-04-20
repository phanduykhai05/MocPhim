import React from "react";

interface NewUpdateCardProps {
  title: string;
  slug: string;
  thumb: string;
  badge: string; // e.g. "Vietsub HD", "Vietsub Full HD"
}

export const NewUpdateCard = ({ title, slug, thumb, badge }: NewUpdateCardProps) => {
  return (
    <div className="group w-full">
      {/* Thumbnail */}
      <div className="relative w-full rounded-[6px] overflow-hidden bg-[#25252b]" style={{ paddingTop: "135.74%" }}>
        <a href={`/phim/${slug}`} title={title} className="absolute inset-0 w-full h-full block overflow-hidden">
          
          {/* Ảnh */}
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
          />

          {/* Dotted overlay */}
          <span className="absolute inset-0 z-[1] pointer-events-none bg-[url('/images/dotted.png')] bg-repeat opacity-20" />

          {/* Gradient bottom */}
          <span className="absolute bottom-[-4px] left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

          {/* Hover overlay */}
          <span className="absolute inset-0 z-[9] bg-[#0b1017]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badge Vietsub/HD */}
          <span className="absolute right-3 bottom-2 z-[1] max-w-[90%] text-white/87 text-[13px] truncate block">
            {badge}
          </span>

          {/* Play button */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="w-[60px] h-[60px] rounded-full bg-[#fadfa3] text-[#2D1B0D] flex items-center justify-center text-[22px]">
              ▶
            </span>
          </span>
        </a>
      </div>

      {/* Title */}
      <div className="pt-2">
        <a
          href={`/phim/${slug}`}
          title={title}
          className="block text-white/90 font-normal leading-[26px] h-[26px] overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:text-[#f472b6] transition-colors"
        >
          {title}
        </a>
      </div>
    </div>
  );
};

export default NewUpdateCard;
