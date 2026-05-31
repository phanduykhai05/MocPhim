import React from "react";
import Image from "next/image";
import Link from "next/link";
import images from "@/assets/images";
import MoviePoster from "@/components/MoviePoster";

export type BadgeItem = { type: "pd" | "lt" | "tm"; text: string; label?: string };

const BADGE_LABEL: Record<BadgeItem["type"], string> = { pd: "PĐ.", tm: "TM.", lt: "LT." };
const BADGE_BG: Record<BadgeItem["type"], string> = {
  pd: "#5e6070",
  tm: "#2ca35d",
  lt: "#6366f1",
};

interface NewUpdateCardProps {
  title: string;
  originName?: string;
  slug: string;
  thumb: string;
  badges: BadgeItem[];
  priority?: boolean;
}

export const NewUpdateCard = ({ title, originName, slug, thumb, badges, priority = false }: NewUpdateCardProps) => {
  return (
    <div className="group w-full">
      {/* Thumbnail */}
      <div className="relative w-full rounded-[6px] overflow-hidden bg-gray-300 dark:bg-[#25252b]" style={{ paddingTop: "135.74%" }}>
        <Link href={`/phim/${slug}`} title={title} className="absolute inset-0 w-full h-full block overflow-hidden">
          
          {/* Ảnh */}
          <MoviePoster
            src={thumb}
            alt={title}
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
          />

          {/* Logo watermark */}
          <span className="absolute top-2 left-2 z-[10] pointer-events-none opacity-80">
            <Image
              src={images.logo}
              alt="MocPhim watermark"
              width={56}
              height={20}
              className="h-auto w-[56px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            />
          </span>

          {/* Dotted overlay */}
          <span className="absolute inset-0 z-[1] pointer-events-none bg-[url('/images/dotted.png')] bg-repeat opacity-20" />

          {/* Gradient bottom */}
          <span className="absolute bottom-[-4px] left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

          {/* Hover overlay */}
          <span className="absolute inset-0 z-[9] bg-[#0b1017]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badge pin */}
          {badges.length > 0 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[10] flex items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
              {badges.map((b) => (
                <div
                  key={b.type}
                  className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white"
                  style={{ backgroundColor: BADGE_BG[b.type] }}
                >
                  <span style={{ fontWeight: 200 }}>{b.label !== undefined ? b.label : BADGE_LABEL[b.type]}</span>
                  <strong className="font-semibold" style={{ fontWeight: 200 }}>{b.text}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Play button */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(39deg, #fecf59, #fff1cc)', color: '#1a1a1a', boxShadow: '0 5px 10px 5px rgba(255, 218, 125, 0.1)' }}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            </span>
          </span>
        </Link>
      </div>

      {/* Title */}
      <div className="pt-2">
        <Link
          href={`/phim/${slug}`}
          title={title}
          className="block text-gray-800 dark:text-white/90 font-normal leading-[26px] h-[26px] overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:text-[#f472b6] transition-colors"
        >
          {title}
        </Link>
        {originName && (
          <p className="text-gray-500 dark:text-white/40 text-[11px] leading-[18px] h-[18px] overflow-hidden text-ellipsis whitespace-nowrap m-0">
            {originName}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewUpdateCard;
