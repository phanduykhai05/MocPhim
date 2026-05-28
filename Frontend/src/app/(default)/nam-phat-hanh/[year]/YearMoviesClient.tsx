"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import images from "@/assets/images";
import { fetchYearMovies, getMovieThumb, type MovieListItem } from "@/lib/api/movie";
import MoviePoster from "@/components/MoviePoster";

const PAGE_SIZE = 40;
const CARD_BADGE_LABEL = {
  episode: "PĐ.",
  quality: "TM.",
} as const;

const CARD_BADGE_BG = {
  episode: "#5e6070",
  quality: "#2ca35d",
} as const;

function MovieCard({
  item,
  cdnImage,
  priority = false,
}: {
  item: MovieListItem;
  cdnImage: string;
  priority?: boolean;
}) {
  const thumb = getMovieThumb(item.thumb_url, cdnImage);

  return (
    <div className="group w-full">
      <div
        className="relative w-full rounded-[6px] overflow-hidden bg-gray-300 dark:bg-[#25252b]"
        style={{ paddingTop: "135.74%" }}
      >
        <Link
          href={`/phim/${item.slug}`}
          title={item.name}
          className="absolute inset-0 w-full h-full block overflow-hidden"
        >
          <MoviePoster
            src={thumb}
            alt={item.name}
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
          />

          <span className="absolute top-2 left-2 z-[10] pointer-events-none opacity-80">
            <Image
              src={images.logo}
              alt="MocPhim"
              width={56}
              height={20}
              className="h-auto w-[56px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            />
          </span>

          {(item.episode_current || item.quality) && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[10] flex items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
              {item.episode_current && (
                <div
                  className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white"
                  style={{ backgroundColor: CARD_BADGE_BG.episode }}
                >
                  <span style={{ fontWeight: 200 }}>{CARD_BADGE_LABEL.episode}</span>
                  <strong className="font-semibold" style={{ fontWeight: 200 }}>{item.episode_current}</strong>
                </div>
              )}
              {item.quality && (
                <div
                  className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white"
                  style={{ backgroundColor: CARD_BADGE_BG.quality }}
                >
                  <span style={{ fontWeight: 200 }}>{CARD_BADGE_LABEL.quality}</span>
                  <strong className="font-semibold" style={{ fontWeight: 200 }}>{item.quality}</strong>
                </div>
              )}
            </div>
          )}

          <span className="absolute bottom-0 left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
        </Link>
      </div>

      <Link href={`/phim/${item.slug}`} title={item.name}>
        <p className="mt-1.5 text-[12px] leading-[16px] text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-2 font-medium transition-colors">
          {item.name}
        </p>
        {item.origin_name && (
          <p className="mt-0.5 text-[11px] leading-[14px] text-gray-400 dark:text-white/35 line-clamp-1">
            {item.origin_name}
          </p>
        )}
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-x-4 gap-y-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="w-full">
          <div className="w-full rounded-[6px] bg-gray-200 dark:bg-white/10 animate-pulse" style={{ paddingTop: "135.74%" }} />
          <div className="mt-2 h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="mt-1 h-3 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function Paginator({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const getPages = (): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <div className="flex justify-center mt-8 mb-6 gap-1.5 flex-wrap items-center">
      <button
        className="px-3 py-1.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        ‹ Trước
      </button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`el-${i}`} className="px-2 text-gray-400 dark:text-white/40">…</span>
        ) : (
          <button
            key={page}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              current === page ? "bg-[#1677ff] text-white" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20"
            }`}
            onClick={() => onChange(page as number)}
            disabled={current === page}
          >
            {page}
          </button>
        )
      )}
      <button
        className="px-3 py-1.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        Sau ›
      </button>
    </div>
  );
}

const SORT_OPTIONS = [
  { label: "Mới nhất", sort_field: "modified_time", sort_type: "desc" },
  { label: "Cũ nhất", sort_field: "modified_time", sort_type: "asc" },
  { label: "Tên A-Z", sort_field: "name", sort_type: "asc" },
  { label: "Tên Z-A", sort_field: "name", sort_type: "desc" },
  { label: "Năm mới", sort_field: "year", sort_type: "desc" },
];

export default function YearMoviesClient({ year }: { year: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const sortField = searchParams.get("sort_field") ?? "modified_time";
  const sortType = searchParams.get("sort_type") ?? "desc";

  const [items, setItems] = useState<MovieListItem[]>([]);
  const [cdnImage, setCdnImage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchYearMovies(year, { page: pageParam, size: PAGE_SIZE, sort_field: sortField, sort_type: sortType }).then((res) => {
      if (cancelled) return;
      setItems(res?.items ?? []);
      setCdnImage(res?.cdnImage ?? "");
      setTotalItems(res?.totalItems ?? 0);
      setTotalPages(res?.totalPages ?? 1);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [year, pageParam, sortField, sortType]);

  useEffect(() => {
    if (loading) return;
    if (totalPages < 1) return;
    if (pageParam <= totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(totalPages));
    router.replace(`/nam-phat-hanh/${year}?${params.toString()}`);
  }, [loading, pageParam, totalPages, router, searchParams, year]);

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => params.set(k, v));
    params.set("page", "1");
    router.push(`/nam-phat-hanh/${year}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/nam-phat-hanh/${year}?${params.toString()}`);
  };

  const currentSort = SORT_OPTIONS.find(
    (o) => o.sort_field === sortField && o.sort_type === sortType
  ) ?? SORT_OPTIONS[0];

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16 3xl:max-w-[2400px] 4xl:max-w-[3200px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-[10px] mb-6">
        <div>
          <h4 className="text-[22px] leading-[32px] font-bold text-gray-900 dark:text-white/90 m-0">
            Năm phát hành:{" "}
            <span className="text-[#1677ff] capitalize">{year}</span>
          </h4>
          {!loading && (
            <p className="text-sm text-gray-500 dark:text-white/35 mt-0.5">
              {totalItems > 0
                ? `${totalItems.toLocaleString()} phim`
                : "Không có phim nào"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-white/40">Sắp xếp:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                currentSort.label === opt.label
                  ? "bg-[#1677ff] text-white"
                  : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/20"
              }`}
              onClick={() => pushParams({ sort_field: opt.sort_field, sort_type: opt.sort_type })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <SkeletonGrid />}

      {!loading && items.length === 0 && (
        <div className="flex items-center justify-center min-h-[30vh] text-gray-400 dark:text-white/40">
          Không có phim nào trong năm này.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-x-4 gap-y-3">
          {items.map((item, index) => (
            <MovieCard key={item._id} item={item} cdnImage={cdnImage} priority={index < 8} />
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <Paginator current={pageParam} total={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}
