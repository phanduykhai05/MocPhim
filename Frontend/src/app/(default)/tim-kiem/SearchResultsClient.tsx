"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import images from "@/assets/images";
import { fetchSearch, getMovieThumb, type MovieListItem } from "@/lib/api/movie";

const PAGE_SIZE = 40;
const CARD_BADGE_LABEL = {
  episode: "PĐ.",
  quality: "TM.",
} as const;

const CARD_BADGE_BG = {
  episode: "#5e6070",
  quality: "#2ca35d",
} as const;

// ─── MovieCard (cùng template FullMoviesClient) ────────────────────────────────
function MovieCard({
  item,
  cdnImage,
  priority = false,
}: {
  item: MovieListItem;
  cdnImage: string;
  priority?: boolean;
}) {
  const src = getMovieThumb(item.thumb_url, cdnImage);
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="group w-full">
      <div
        className="relative w-full rounded-[6px] overflow-hidden bg-[#25252b]"
        style={{ paddingTop: "135.74%" }}
      >
        <Link
          href={`/phim/${item.slug}`}
          title={item.name}
          className="absolute inset-0 w-full h-full block overflow-hidden"
        >
          <Image
            src={imgSrc}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-[6px]"
            onError={() =>
              setImgSrc(
                `https://via.placeholder.com/200x271/25252b/ffffff?text=${encodeURIComponent(item.name.slice(0, 10))}`
              )
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

          {/* Badge pin */}
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

          {/* Gradient bottom */}
          <span className="absolute bottom-0 left-0 w-full h-1/2 z-[1] rounded-b-[6px] bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
        </Link>
      </div>

      {/* Tên phim */}
      <Link href={`/phim/${item.slug}`} title={item.name}>
        <p className="mt-1.5 text-[12px] leading-[16px] text-white/80 group-hover:text-white line-clamp-2 font-medium transition-colors">
          {item.name}
        </p>
        {item.origin_name && (
          <p className="mt-0.5 text-[11px] leading-[14px] text-white/35 line-clamp-1">
            {item.origin_name}
          </p>
        )}
      </Link>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
      {Array.from({ length: count }).map((_, i) => (
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
  );
}

// ─── Inline search bar trên trang ─────────────────────────────────────────────
function SearchInput({
  defaultValue,
  onSearch,
}: {
  defaultValue: string;
  onSearch: (kw: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <form
      className="flex gap-2 w-full max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSearch(value.trim());
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm phim..."
        className="flex-1 h-10 px-4 bg-white/10 text-white text-sm rounded-md border border-transparent focus:bg-white/15 focus:border-white/20 outline-none transition-all placeholder:text-white/35"
      />
      <button
        type="submit"
        className="h-10 px-5 rounded-md bg-[#1677ff] text-white text-sm font-medium hover:bg-[#1677ff]/80 transition-colors"
      >
        Tìm
      </button>
    </form>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") ?? "";

  const [allItems, setAllItems] = useState<MovieListItem[]>([]);
  const [cdnImage, setCdnImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch khi keyword thay đổi
  useEffect(() => {
    if (!keyword) {
      setAllItems([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setCurrentPage(1);
    fetchSearch(keyword).then((res) => {
      if (cancelled) return;
      setAllItems(res?.items ?? []);
      setCdnImage(res?.cdnImage ?? "");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [keyword]);

  const handleSearch = (kw: string) => {
    router.push(`/tim-kiem?keyword=${encodeURIComponent(kw)}`);
  };

  // Phân trang client-side
  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const pageItems = allItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-[10px] mb-6">
        <div>
          <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0">
            {keyword ? (
              <>
                Kết quả tìm kiếm: &ldquo;
                <span className="text-[#1677ff]">{keyword}</span>
                &rdquo;
              </>
            ) : (
              "Tìm kiếm phim"
            )}
          </h4>
          {!loading && keyword && (
            <p className="text-sm text-white/35 mt-0.5">
              {allItems.length > 0
                ? `Tìm thấy ${allItems.length.toLocaleString()} kết quả`
                : "Không tìm thấy kết quả nào"}
            </p>
          )}
        </div>
        <SearchInput defaultValue={keyword} onSearch={handleSearch} />
      </div>

      {/* No keyword */}
      {!keyword && (
        <div className="flex items-center justify-center min-h-[30vh] text-white/30 text-base">
          Nhập từ khóa để tìm kiếm phim
        </div>
      )}

      {/* Loading */}
      {loading && <SkeletonGrid count={PAGE_SIZE} />}

      {/* Empty */}
      {!loading && keyword && allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3 text-white/40">
          <p className="text-base">Không tìm thấy phim nào cho &ldquo;{keyword}&rdquo;</p>
          <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Grid */}
      {!loading && pageItems.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-3">
          {pageItems.map((item, index) => (
            <MovieCard
              key={item._id}
              item={item}
              cdnImage={cdnImage}
              priority={index < 8}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Paginator
          current={currentPage}
          total={totalPages}
          onChange={handlePageChange}
        />
      )}
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
          <span key={`el-${i}`} className="px-2 text-white/40">…</span>
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
