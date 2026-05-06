"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MagnifierIcon from "@/components/icon/magnifier-icon";
import {
  fetchSearch,
  fetchSearchHistory,
  getMovieThumb,
  type MovieListItem,
  type SearchHistoryItem,
} from "@/lib/api/movie";

const DEBOUNCE_MS = 350;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const TYPE_LABEL: Record<string, string> = {
  series: "Phim bộ",
  single: "Phim lẻ",
  hoathinh: "Hoạt hình",
  tvshows: "TV Shows",
};

const SearchBar = () => {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MovieListItem[]>([]);
  const [cdnImage, setCdnImage] = useState("");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);
  const open = isFocused && (debouncedQuery.length > 0 || history.length > 0);

  // Load search history khi focus lần đầu
  const loadHistory = useCallback(async () => {
    if (historyLoaded) return;
    const data = await fetchSearchHistory(8);
    setHistory(data);
    setHistoryLoaded(true);
  }, [historyLoaded]);

  // Realtime search
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchSearch(debouncedQuery).then((res) => {
      if (cancelled) return;
      setResults(res?.items.slice(0, 8) ?? []);
      setCdnImage(res?.cdnImage ?? "");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Click ngoài → đóng dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (kw: string) => {
    if (!kw.trim()) return;
    setIsFocused(false);
    setQuery(kw);
    router.push(`/tim-kiem?keyword=${encodeURIComponent(kw.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit(query);
    if (e.key === "Escape") setIsFocused(false);
  };

  const showHistory = debouncedQuery === "" && history.length > 0;
  const showResults = debouncedQuery !== "" && (loading || results.length > 0);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[23rem] hidden md:block">
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
          <MagnifierIcon size={22} color="white" strokeWidth={1.5} />
        </div>
        <input
          ref={inputRef}
          type="text"
          id="main-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setIsFocused(true); loadHistory(); }}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm phim, diễn viên"
          autoComplete="off"
          className="w-full h-[2.8rem] pl-[3rem] pr-9 bg-white/10 text-white text-sm outline-none rounded-md border border-transparent focus:bg-white/20 transition-all placeholder:text-gray-300"
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            tabIndex={-1}
            aria-label="Xóa"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg bg-[#1e2030] border border-white/10 shadow-2xl overflow-hidden">

          {/* Lịch sử tìm kiếm */}
          {showHistory && (
            <>
              <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                Xu hướng tìm kiếm
              </div>
              <ul>
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      onMouseDown={() => handleSubmit(item.keyword)}
                    >
                      <MagnifierIcon size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                      <span className="text-sm text-white/70 flex-1 truncate">{item.keyword}</span>
                      <span className="text-[11px] text-white/25">{item.searchCount.toLocaleString()} lượt</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Kết quả tìm kiếm */}
          {showResults && (
            <>
              <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                {loading ? "Đang tìm..." : `Kết quả cho "${debouncedQuery}"`}
              </div>

              {loading && (
                <ul>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="w-9 h-12 rounded bg-white/10 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && results.length === 0 && (
                <p className="px-4 py-4 text-sm text-white/40 text-center">
                  Không tìm thấy kết quả nào.
                </p>
              )}

              {!loading && results.length > 0 && (
                <ul>
                  {results.map((movie) => (
                    <li key={movie._id}>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsFocused(false);
                          router.push(`/phim/${movie.slug}`);
                        }}
                      >
                        {/* Poster */}
                        <div className="relative w-9 h-12 rounded overflow-hidden bg-[#25252b] shrink-0">
                          <Image
                            src={getMovieThumb(movie.thumb_url, cdnImage)}
                            alt={movie.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white leading-tight truncate font-medium">
                            {movie.name}
                          </p>
                          <p className="text-[12px] text-white/40 truncate mt-0.5">
                            {movie.origin_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {movie.year > 0 && (
                              <span className="text-[11px] text-white/30">{movie.year}</span>
                            )}
                            {movie.quality && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                {movie.quality}
                              </span>
                            )}
                            {TYPE_LABEL[movie.type] && (
                              <span className="text-[10px] text-white/30">
                                {TYPE_LABEL[movie.type]}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Episode */}
                        <span className="text-[11px] text-white/30 shrink-0 text-right max-w-[60px] truncate">
                          {movie.episode_current}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Xem tất cả kết quả */}
              {!loading && results.length > 0 && (
                <button
                  className="w-full px-4 py-2.5 text-sm text-[#1677ff] hover:bg-white/5 transition-colors text-center border-t border-white/5"
                  onMouseDown={() => handleSubmit(query)}
                >
                  Xem tất cả kết quả cho &ldquo;{query}&rdquo;
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;