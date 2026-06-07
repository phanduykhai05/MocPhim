"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import images from "@/assets/images";
import { fetchMovieList, getMovieThumb, type MovieListItem } from "@/lib/api/movie";
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

const SORT_OPTIONS = [
  { label: "Mới nhất", sort_field: "modified_time", sort_type: "desc" },
  { label: "Cũ nhất", sort_field: "modified_time", sort_type: "asc" },
  { label: "Tên A-Z", sort_field: "name", sort_type: "asc" },
  { label: "Tên Z-A", sort_field: "name", sort_type: "desc" },
  { label: "Năm mới", sort_field: "year", sort_type: "desc" },
] as const;

function MovieCard({ item, cdnImage, priority = false }: { item: MovieListItem; cdnImage: string; priority?: boolean }) {
  const thumb = getMovieThumb(item.thumb_url, cdnImage);

  return (
    <div className="group w-full">
      <div className="relative w-full rounded-[6px] overflow-hidden bg-[#25252b]" style={{ paddingTop: "135.74%" }}>
        <Link href={`/phim/${item.slug}`} title={item.name} className="absolute inset-0 w-full h-full block overflow-hidden">
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
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: CARD_BADGE_BG.episode }}>
                  <span style={{ fontWeight: 200 }}>{CARD_BADGE_LABEL.episode}</span>
                  <strong className="font-semibold" style={{ fontWeight: 200 }}>{item.episode_current}</strong>
                </div>
              )}
              {item.quality && (
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: CARD_BADGE_BG.quality }}>
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
        <p className="mt-1.5 text-[12px] leading-[16px] text-white/80 group-hover:text-white line-clamp-2 font-medium transition-colors">
          {item.name}
        </p>
        {item.origin_name && <p className="mt-0.5 text-[11px] leading-[14px] text-white/35 line-clamp-1">{item.origin_name}</p>}
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="w-full">
          <div className="w-full rounded-[6px] bg-white/10 animate-pulse" style={{ paddingTop: "135.74%" }} />
          <div className="mt-2 h-3 bg-white/10 rounded animate-pulse" />
          <div className="mt-1 h-3 w-3/4 bg-white/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function Paginator({ current, onChange, canGoNext }: { current: number; onChange: (p: number) => void; canGoNext: boolean }) {
  return (
    <div className="flex justify-center mt-8 mb-6 gap-1.5 flex-wrap items-center">
      <button
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        ‹ Trước
      </button>

      <span className="px-3 py-1.5 text-sm text-white/70">Trang {current}</span>

      <button
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current + 1)}
        disabled={!canGoNext}
      >
        Sau ›
      </button>
    </div>
  );
}

export default function MoviesByListClient({ listKey, title, routeBase }: { listKey: "phim-le" | "phim-bo"; title: string; routeBase: "/phim-le" | "/phim-bo" }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const sortField = searchParams.get("sort_field") ?? "modified_time";
  const sortType = searchParams.get("sort_type") ?? "desc";

  const [items, setItems] = useState<MovieListItem[]>([]);
  const [cdnImage, setCdnImage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [hasPaginationMeta, setHasPaginationMeta] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchMovieList({
      list: listKey,
      page: pageParam,
      size: PAGE_SIZE,
      sort_field: sortField,
      sort_type: sortType,
    }).then((res) => {
      if (cancelled) return;
      const nextItems = res?.items ?? [];
      setItems(nextItems);
      setCdnImage(res?.cdnImage ?? "");
      setTotalItems(res?.totalItems ?? nextItems.length);

      const hasMeta = (res?.totalPages ?? 1) > 1 || (res?.totalItems ?? 0) > nextItems.length;
      setHasPaginationMeta(hasMeta);
      setTotalPages(res?.totalPages ?? 1);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [listKey, pageParam, sortField, sortType]);

  useEffect(() => {
    if (loading) return;
    if (items.length > 0) return;
    if (pageParam <= 1) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageParam - 1));
    router.replace(`${routeBase}?${params.toString()}`);
  }, [items.length, loading, pageParam, routeBase, router, searchParams]);

  useEffect(() => {
    if (loading) return;
    if (!hasPaginationMeta) return;
    if (totalPages < 1) return;
    if (pageParam <= totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(totalPages));
    router.replace(`${routeBase}?${params.toString()}`);
  }, [hasPaginationMeta, loading, pageParam, routeBase, router, searchParams, totalPages]);

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => params.set(k, v));
    params.set("page", "1");
    router.push(`${routeBase}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${routeBase}?${params.toString()}`);
  };

  const currentSort =
    SORT_OPTIONS.find((o) => o.sort_field === sortField && o.sort_type === sortType) ?? SORT_OPTIONS[0];

  const canGoNext = hasPaginationMeta ? pageParam < totalPages : items.length >= PAGE_SIZE;

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-[10px] mb-6">
        <div>
          <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">{title}</h4>
          {!loading && (
            <p className="text-sm text-white/35 mt-0.5">
              {items.length === 0
                ? "Không có phim nào"
                : hasPaginationMeta && totalItems > 0
                ? `${totalItems.toLocaleString()} phim`
                : null}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-white/40">Sắp xếp:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                currentSort.label === opt.label ? "bg-[#1677ff] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
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
        <div className="flex items-center justify-center min-h-[30vh] text-white/40">Không có phim nào trong danh sách này.</div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
          {items.map((item, index) => (
            <MovieCard key={item._id} item={item} cdnImage={cdnImage} priority={index < 8} />
          ))}
        </div>
      )}

      {!loading && items.length > 0 && <Paginator current={pageParam} onChange={handlePageChange} canGoNext={canGoNext} />}
    </div>
  );
}
