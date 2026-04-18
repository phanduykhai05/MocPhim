"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { TopSeriesCard } from "@/app/(default)/phimmoi/components/TopseriCard/components/TopSeriesCard";

export const TopSeriesList = () => {
  const swiperRef = React.useRef<any>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    const refreshSwiper = () => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;

      const relayout = () => {
        if (swiper.destroyed) return;
        // Re-apply breakpoint first, then recalc sizes/slides to avoid oversize cards.
        if (typeof swiper.setBreakpoint === "function") swiper.setBreakpoint();
        if (typeof swiper.updateSize === "function") swiper.updateSize();
        if (typeof swiper.updateSlides === "function") swiper.updateSlides();
        if (typeof swiper.updateProgress === "function") swiper.updateProgress();
        if (typeof swiper.updateSlidesClasses === "function") swiper.updateSlidesClasses();
        swiper.update();
      };

      requestAnimationFrame(relayout);
      requestAnimationFrame(() => requestAnimationFrame(relayout));

      setTimeout(() => {
        relayout();
      }, 160);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshSwiper();
    };

    window.addEventListener("pageshow", refreshSwiper);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pageshow", refreshSwiper);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Dữ liệu mẫu bóc từ HTML
  const topMovies = [
    {
      title: "One Piece",
      alias: "Đảo Hải Tặc, Vua Hải Tặc, OP",
      slug: "one-piece",
      thumb: "https://rophims.vip/wp-content/uploads/2026/04/one-piece-39120-thumb-149.jpg",
      episodeText: "Tập 1157",
      badges: [
        { type: "pd" as const, text: "1157" },
        { type: "lt" as const, text: "1157" },
      ],
    },
    {
      title: "Nguyệt Lân Ỷ Kỷ",
      alias: "Veil of Shadows",
      slug: "nguyet-lan-y-ky",
      thumb: "https://rophims.vip/wp-content/uploads/2026/04/nguyet-lan-y-ky-38622-thumb-196.jpg",
      episodeText: "Tập 29",
      badges: [{ type: "pd" as const, text: "29" }],
    },
    {
      title: "Trục Ngọc",
      alias: "Pursuit Of Jade",
      slug: "truc-ngoc",
      thumb: "https://rophims.vip/wp-content/uploads/2026/03/truc-ngoc-23313-thumb-4.jpg",
      episodeText: "Hoàn Tất (40/40)",
      badges: [
        { type: "pd" as const, text: "HT" },
        { type: "tm" as const, text: "HT" },
      ],
    },
    // ... bạn map nốt data còn lại
  ];

  return (
    <div className="w-full max-w-[1900px] px-4 md:px-[50px] mx-auto relative mb-10">
      {/* Header */}
      <div className="flex items-center justify-start gap-4 relative min-h-[44px] mb-5">
        <h2 className="text-[2rem] leading-[1.4] font-semibold m-0 text-[#ffebc6] drop-shadow-[0_2px_1px_rgba(0,0,0,0.3)]">
          Top 10 Phim Bộ Hôm Nay
        </h2>
      </div>

      {/* Nội dung Carousel */}
      <div className="relative top-up group">
        {isMounted ? (
          <>
            {/* Nút điều hướng - Ẩn mặc định, hiện khi hover */}
            <div className="absolute inset-y-0 w-full flex items-center justify-between z-10 pointer-events-none">
              {/* Nút Prev */}
              <button
                id="top-series-prev"
                className="pointer-events-auto p-1.5 bg-transparent text-white opacity-0 group-hover:opacity-50 !opacity-100 transition-opacity -translate-x-full disabled:hidden"
                aria-label="Previous slide"
              >
                <svg className="w-12 h-12" fill="none" viewBox="0 0 16 16">
                  <path d="M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </button>

              {/* Nút Next */}
              <button
                id="top-series-next"
                className="pointer-events-auto p-1.5 bg-transparent text-white opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity translate-x-full disabled:hidden"
                aria-label="Next slide"
              >
                <svg className="w-12 h-12" fill="none" viewBox="0 0 16 16">
                  <path d="M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            {/* Swiper Slider */}
            <Swiper
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // Ensure correct slide widths on first mount too.
                requestAnimationFrame(() => {
                  if (!swiper.destroyed) {
                    if (typeof swiper.setBreakpoint === "function") swiper.setBreakpoint();
                    swiper.update();
                  }
                });
              }}
              observer
              observeParents
              updateOnWindowResize
              navigation={{
                prevEl: "#top-series-prev",
                nextEl: "#top-series-next",
              }}
              spaceBetween={16}
              slidesPerView={2} // Mặc định mobile 2 cột
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
                1440: { slidesPerView: 6 },
              }}
              className="!px-1" // Thêm chút padding để đổ bóng không bị lẹm
            >
              {topMovies.map((movie, index) => (
                <SwiperSlide key={index}>
                  <TopSeriesCard index={index} movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};