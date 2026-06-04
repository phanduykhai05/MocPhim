"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetBookmarks, type BookmarkItem } from "@/lib/api/bookmarks";
import { getMovieThumb } from "@/lib/api/movie";
import { TopSeriesCard } from "@/app/(default)/phimmoi/components/TopseriCard/components/TopSeriesCard";

function resolveThumb(item: BookmarkItem): string {
  if (item.thumbUrl) return item.thumbUrl;
  // derive thumb from poster URL: *-poster.jpg → *-thumb.jpg
  if (item.posterUrl?.includes('-poster.')) {
    return item.posterUrl.replace('-poster.', '-thumb.');
  }
  return item.posterUrl;
}

function toCardProps(item: BookmarkItem, index: number) {
  return {
    title: item.movieTitle,
    alias: item.mediaType === "single" ? "Phim Lẻ" : "Phim Bộ",
    slug: item.slug,
    thumb: getMovieThumb(resolveThumb(item)),
    episodeText: item.latestEpisode != null
      ? `Đang xem tập ${item.latestEpisode}`
      : "Chưa xem",
    badges: item.latestEpisode != null
      ? [{ type: "pd" as const, label: "Tập", text: String(item.latestEpisode) }]
      : [{ type: "pd" as const, label: item.mediaType === "single" ? "Phim" : "Tập", text: item.mediaType === "single" ? "Lẻ" : "Bộ" }],
  };
}

export default function BookmarkedMovies() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<{ update: () => void; destroyed: boolean } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchBookmarks = React.useCallback(() => {
    if (!user) return;
    setLoading(true);
    apiGetBookmarks(user.id)
      .then(setBookmarks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Refetch khi quay lại tab/trang (sau khi xem phim)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchBookmarks();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchBookmarks]);

  if (authLoading || !user || (!loading && bookmarks.length === 0)) return null;

  return (
    <div className="w-full max-w-[1900px] px-4 md:px-[50px] mx-auto relative mb-10 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[80px] 4xl:px-[120px]">
      {/* Header */}
      <div className="flex items-center justify-start gap-4 relative min-h-[44px] mb-5">
        <h4 className="text-[22px] leading-[32px] font-bold text-gray-900 dark:text-white/90 m-0 flex items-center gap-2">
          <span className="text-[#f472b6]">♥</span>
          Phim Yêu Thích Của Bạn
        </h4>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white/5 aspect-[2/3]" />
          ))}
        </div>
      )}

      {/* Carousel */}
      {!loading && isMounted && (
        <div className="relative group">
          {/* Prev */}
          <button
            id="fav-prev"
            className="pointer-events-auto p-1.5 bg-transparent text-gray-800 dark:text-white opacity-0 group-hover:opacity-50 !opacity-100 transition-opacity -translate-x-full disabled:hidden absolute left-0 top-1/3 -translate-y-1/2 z-10"
            aria-label="Previous"
          >
            <svg className="w-12 h-12" fill="none" viewBox="0 0 16 16">
              <path d="M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Next */}
          <button
            id="fav-next"
            className="pointer-events-auto p-1.5 bg-transparent text-gray-800 dark:text-white opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity translate-x-full disabled:hidden absolute right-0 top-1/3 -translate-y-1/2 z-10"
            aria-label="Next"
          >
            <svg className="w-12 h-12" fill="none" viewBox="0 0 16 16">
              <path d="M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            navigation={{ prevEl: "#fav-prev", nextEl: "#fav-next" }}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640:  { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1440: { slidesPerView: 6 },
              1920: { slidesPerView: 8 },
              2560: { slidesPerView: 10 },
            }}
            className="!px-1"
          >
            {bookmarks.map((item, index) => (
              <SwiperSlide key={item.id}>
                <TopSeriesCard
                  index={index}
                  movie={toCardProps(item, index)}
                  priority={index < 3}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
