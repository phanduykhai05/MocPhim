"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NewUpdateCard } from "@/app/(default)/phimmoi/components/MovieUpdate/components/NewUpdateCard";

const CDN = process.env.NEXT_PUBLIC_CDN_IMAGE ?? "https://img.ophim.live";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://103.229.53.17/api/v1";
const PAGE_SIZE = 40;

interface Movie {
  slug: string;
  title: string;
  thumb: string;
  badge: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function FullMoviesClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/history?page=${page - 1}&size=${PAGE_SIZE}`);
      const json = await res.json();
      if (!json?.status) return;

      const mapped: Movie[] = (json.data ?? []).map((item: { slug: string; title: string }) => ({
        slug: item.slug,
        title: item.title,
        thumb: `${CDN}/uploads/movies/${item.slug}-thumb.jpg`,
        badge: "HD",
      }));

      setMovies(mapped);
      setPagination({
        currentPage: json.pagination?.currentPage ?? page,
        totalPages: json.pagination?.totalPages ?? 1,
        totalItems: json.pagination?.totalItems ?? 0,
      });
    } catch (e) {
      console.error(e);
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

  // Render skeleton khi đang load
  if (loading) {
    return (
      <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px]">
        <div className="flex items-center mt-[10px] mb-4">
          <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">Danh sách phim</h4>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-2">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="w-full">
              <div className="w-full rounded-[6px] bg-white/10 animate-pulse" style={{ paddingTop: "135.74%" }} />
              <div className="mt-2 h-4 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mt-[10px] mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">
          Danh sách phim
          <span className="ml-3 text-sm font-normal text-white/40">{pagination.totalItems.toLocaleString()} phim</span>
        </h4>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-2">
        {movies.map((movie, index) => (
          <NewUpdateCard key={movie.slug} {...movie} priority={index < 4} />
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

function Paginator({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <div className="flex justify-center mt-8 mb-4 gap-1.5 flex-wrap items-center">
      <button
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        ‹ Trước
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-white/40">…</span>
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
        className="px-3 py-1.5 rounded bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 text-sm"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        Sau ›
      </button>
    </div>
  );
}
