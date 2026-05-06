"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "@/assets/images";

const CDN = process.env.NEXT_PUBLIC_CDN_IMAGE ?? "https://img.ophim.live";
const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 40;

// ─── Types khớp với MovieSync entity của backend ─────────────────────────────
interface MovieSyncItem {
  id: number;
  slug: string;
  title: string;
  modifiedAt: string;
  createdAt: string;
}

interface SyncPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ─── SyncMovieCard (dùng riêng cho trang này, tự handle lỗi ảnh) ─────────────
function SyncMovieCard({
  slug,
  title,
  priority = false,
}: {
  slug: string;
  title: string;
  priority?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(`${CDN}/uploads/movies/${slug}-thumb.jpg`);

  return (
    <div className="group w-full">
      <div
        className="relative w-full rounded-[6px] overflow-hidden bg-[#25252b]"
        style={{ paddingTop: "135.74%" }}
      >
        <Link
          href={`/phim/${slug}`}
          title={title}
          className="absolute inset-0 w-full h-full block overflow-hidden"
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
            onError={() =>
              setImgSrc(`https://via.placeholder.com/200x271/25252b/ffffff?text=${encodeURIComponent(title.slice(0, 10))}`)
            }
          />

          {/* Logo watermark */}
          <span className="absolute top-2 left-2 z-[10] pointer-events-none opacity-80">
            <Image
              src={images.logo}
              alt="MocPhim"
              width={56}
              height={20}
              className="h-auto w-[56px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            />
          </span>

          {/* Gradient bottom */}
          <span className="absolute bottom-0 left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
        </Link>
      </div>

      {/* Tên phim */}
      <Link href={`/phim/${slug}`} title={title}>
        <p className="mt-1.5 text-[12px] leading-[16px] text-white/80 group-hover:text-white line-clamp-2 font-medium transition-colors">
          {title}
        </p>
      </Link>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] lg:pt-20 pt-16">
      <div className="flex items-center mt-[10px] mb-4">
        <div className="h-7 w-48 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className="w-full">
            <div
              className="w-full rounded-[6px] bg-white/10 animate-pulse"
              style={{ paddingTop: "135.74%" }}
            />
            <div className="mt-2 h-3 bg-white/10 rounded animate-pulse" />
            <div className="mt-1 h-3 w-3/4 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
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
  const [movies, setMovies] = useState<MovieSyncItem[]>([]);
  const [pagination, setPagination] = useState<SyncPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Backend dùng 0-indexed page, currentPage trong response là 1-indexed
  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API}/sync/movies?page=${page - 1}&size=${PAGE_SIZE}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // Response: { status: true, message: "success", data: MovieSync[], pagination: {...} }
      if (!json?.status) throw new Error("API returned status false");

      setMovies(json.data ?? []);
      setPagination({
        currentPage: json.pagination?.currentPage ?? page,
        totalPages: json.pagination?.totalPages ?? 1,
        totalItems: json.pagination?.totalItems ?? 0,
        itemsPerPage: json.pagination?.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      console.error("[FullMoviesClient] fetch error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPage(page);
  };

  if (loading) return <SkeletonGrid />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-white/50 gap-3">
        <p className="text-base">Không thể tải danh sách phim.</p>
        <button
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm transition-colors"
          onClick={() => fetchPage(pagination.currentPage)}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-white/40">
        <p>Chưa có phim nào được đồng bộ.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 animate-fade-in-up lg:pt-20 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mt-[10px] mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">
          Danh sách phim
          <span className="ml-3 text-sm font-normal text-white/40">
            {pagination.totalItems.toLocaleString()} phim
          </span>
        </h4>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
        {movies.map((movie, index) => (
          <SyncMovieCard
            key={movie.id}
            slug={movie.slug}
            title={movie.title}
            priority={index < 8}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Paginator
          current={pagination.currentPage}
          total={pagination.totalPages}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
