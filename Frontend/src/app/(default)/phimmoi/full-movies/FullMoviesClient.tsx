"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import images from "@/assets/images";
import { fetchSyncMovies, type MovieSyncItem } from "@/lib/api/sync";

const CDN = process.env.NEXT_PUBLIC_CDN_IMAGE ?? "https://img.ophim.live";
const PAGE_SIZE = 40;

const CARD_BADGE_LABEL = { episode: "PĐ.", quality: "TM." } as const;
const CARD_BADGE_BG = { episode: "#5e6070", quality: "#2ca35d" } as const;

// ─── MovieCard ────────────────────────────────────────────────────────────────
function MovieCard({ item, priority = false }: { item: MovieSyncItem; priority?: boolean }) {
  const thumb = item.thumbUrl
    ? item.thumbUrl.startsWith("http")
      ? item.thumbUrl
      : `${CDN}/uploads/movies/${item.thumbUrl}`
    : `${CDN}/uploads/movies/${item.slug}-thumb.jpg`;

  const [imgSrc, setImgSrc] = useState(thumb);

  return (
    <div className="group w-full">
      <div className="relative w-full rounded-[6px] overflow-hidden bg-[#25252b]" style={{ paddingTop: "135.74%" }}>
        <Link href={`/phim/${item.slug}`} title={item.title} className="absolute inset-0 w-full h-full block overflow-hidden">
          <Image
            src={imgSrc}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
            onError={() =>
              setImgSrc(`https://via.placeholder.com/200x271/25252b/ffffff?text=${encodeURIComponent(item.title.slice(0, 10))}`)
            }
          />

          {/* Logo watermark */}
          <span className="absolute top-2 left-2 z-[10] pointer-events-none opacity-80">
            <Image src={images.logo} alt="MocPhim" width={56} height={20} className="h-auto w-[56px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          </span>

          {/* Badge pin */}
          {(item.episodeCurrent || item.quality) && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[10] flex items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
              {item.episodeCurrent && (
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: CARD_BADGE_BG.episode }}>
                  <span style={{ fontWeight: 200 }}>{CARD_BADGE_LABEL.episode}</span>
                  <strong style={{ fontWeight: 200 }}>{item.episodeCurrent}</strong>
                </div>
              )}
              {item.quality && (
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: CARD_BADGE_BG.quality }}>
                  <span style={{ fontWeight: 200 }}>{CARD_BADGE_LABEL.quality}</span>
                  <strong style={{ fontWeight: 200 }}>{item.quality}</strong>
                </div>
              )}
            </div>
          )}

          <span className="absolute bottom-0 left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
        </Link>
      </div>

      <Link href={`/phim/${item.slug}`} title={item.title}>
        <p className="mt-1.5 text-[12px] leading-[16px] text-white/80 group-hover:text-white line-clamp-2 font-medium transition-colors">
          {item.title}
        </p>
        {item.originName && (
          <p className="mt-0.5 text-[11px] leading-[14px] text-white/35 line-clamp-1">{item.originName}</p>
        )}
      </Link>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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

// ─── Paginator ────────────────────────────────────────────────────────────────
function Paginator({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const getPages = (): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <div className="flex justify-center mt-8 mb-6 gap-1.5 flex-wrap items-center">
      <button
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        ‹ Trước
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`el-${i}`} className="px-2 text-white/40">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              current === page
                ? "bg-[#1677ff] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
            onClick={() => onChange(page as number)}
            disabled={current === page}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        Sau ›
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FullMoviesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const [items, setItems] = useState<MovieSyncItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchSyncMovies(pageParam - 1, PAGE_SIZE).then((result) => {
      if (cancelled) return;
      if (!result) { setError(true); setLoading(false); return; }
      setItems(result.items);
      setTotalItems(result.pagination.totalItems);
      setTotalPages(result.pagination.totalPages);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [pageParam]);

  useEffect(() => {
    if (loading) return;
    if (totalPages < 1) return;
    if (pageParam <= totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(totalPages));
    router.replace(`/phimmoi/full-movies?${params.toString()}`);
  }, [loading, pageParam, totalPages, router, searchParams]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/phimmoi/full-movies?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-[10px] mb-6">
        <div>
          <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">Danh sách phim</h4>
          {!loading && totalItems > 0 && (
            <p className="text-sm text-white/35 mt-0.5">{totalItems.toLocaleString()} phim</p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && <SkeletonGrid />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-white/50 gap-3">
          <p className="text-base">Không thể tải danh sách phim.</p>
          <button
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm transition-colors"
            onClick={() => handlePageChange(pageParam)}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <div className="flex items-center justify-center min-h-[40vh] text-white/40">
          Chưa có phim nào được đồng bộ.
        </div>
      )}

      {/* Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
          {items.map((item, index) => (
            <MovieCard key={item.id} item={item} priority={index < 8} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Paginator current={pageParam} total={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}
