"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetBookmarks, type BookmarkItem } from "@/lib/api/bookmarks";
import { getMovieThumb } from "@/lib/api/movie";
import MoviePoster from "@/components/MoviePoster";

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return "Vừa xong";
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch { return ""; }
}

function WatchedCard({ item }: { item: BookmarkItem }) {
  const href = `/xem-phim/${item.slug}${item.latestEpisode ? `?tap=${item.latestEpisode}` : ""}`;
  const ep = item.latestEpisode;
  const isCompleted = item.episodeCompleted ?? false;

  return (
    <Link href={href} className="group block no-underline">
      {/* Thumbnail — landscape 16:9 */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1e2030] mb-3">
        <MoviePoster
          src={getMovieThumb(item.posterUrl)}
          alt={item.movieTitle}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Dimming overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(39deg, #fecf59, #fff1cc)', color: '#1a1a1a', boxShadow: '0 5px 10px 5px rgba(255, 218, 125, 0.1)' }}
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
          </div>
        </div>

        {/* Badge — đồng bộ NewUpdateCard */}
        {ep != null && (
          <div className="absolute bottom-0 left-2 z-[10] flex items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
            <div
              className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] text-white"
              style={{ backgroundColor: isCompleted ? "#2ca35d" : "#5e6070" }}
            >
              <span style={{ fontWeight: 200 }}>{isCompleted ? "Đang xem HT." : "Đang xem Tập"}</span>
              <strong style={{ fontWeight: 200 }}>{ep}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Text info below card */}
      <p className="text-[13.5px] font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#f472b6] transition-colors leading-snug">
        {item.movieTitle}
      </p>
      <p className="text-[12px] text-gray-500 dark:text-white/45 line-clamp-1 mt-0.5">
        {item.lastWatchedAt ? formatRelativeTime(item.lastWatchedAt) : ""}
      </p>
    </Link>
  );
}

export default function WatchedMovies() {
  const { user, isLoading: authLoading } = useAuth();
  const [watched, setWatched] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<{ update: () => void; destroyed: boolean } | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const fetchWatched = React.useCallback(() => {
    if (!user) return;
    setLoading(true);
    apiGetBookmarks(user.id)
      .then((items) => {
        setWatched(
          items
            .filter((b) => b.lastWatchedAt != null)
            .sort((a, b) => {
              const ta = a.lastWatchedAt ? +new Date(a.lastWatchedAt) : 0;
              const tb = b.lastWatchedAt ? +new Date(b.lastWatchedAt) : 0;
              return tb - ta;
            })
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { fetchWatched(); }, [fetchWatched]);

  useEffect(() => {
    const fn = () => { if (document.visibilityState === "visible") fetchWatched(); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, [fetchWatched]);

  if (authLoading || !user || (!loading && watched.length === 0)) return null;

  return (
    <div className="w-full max-w-[1900px] px-4 md:px-[50px] mx-auto mb-10 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[80px] 4xl:px-[120px]">
      <div className="flex gap-8 items-start">

        {/* ── Left: Section title ── */}
        <div className="hidden md:flex flex-col gap-3 shrink-0 w-[120px] pt-1">
          <h4 className="text-[1.5rem] font-bold leading-tight m-0 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(255, 0, 153) 130%)' }}>
            Tiếp Tục<br />Xem
          </h4>
          <Link
            href="/phim-bo"
            className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-white/50 hover:text-[#f472b6] dark:hover:text-[#f472b6] transition-colors no-underline"
          >
            Xem toàn bộ
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Right: Carousel ── */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="flex md:hidden items-center justify-between mb-3">
            <h4 className="text-base font-bold m-0 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(255, 0, 153) 130%)' }}>Tiếp Tục Xem</h4>
            <Link href="/phim-bo" className="text-sm text-gray-500 dark:text-white/50 hover:text-[#f472b6] flex items-center gap-0.5 no-underline">
              Xem toàn bộ
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-gray-200 dark:bg-white/5 aspect-video" />
              ))}
            </div>
          )}

          {!loading && isMounted && (
            <div className="relative group/slider">
              {/* Prev */}
              <button
                id="wcont-prev"
                className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#252836] rounded-full shadow-lg text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden"
                aria-label="Previous"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next */}
              <button
                id="wcont-next"
                className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-4 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#252836] rounded-full shadow-lg text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden"
                aria-label="Next"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <Swiper
                modules={[Navigation]}
                onSwiper={(s) => { swiperRef.current = s; }}
                navigation={{ prevEl: "#wcont-prev", nextEl: "#wcont-next" }}
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  480:  { slidesPerView: 2 },
                  640:  { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1440: { slidesPerView: 5 },
                  1920: { slidesPerView: 5 },
                }}
              >
                {watched.map((item) => (
                  <SwiperSlide key={item.id}>
                    <WatchedCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
