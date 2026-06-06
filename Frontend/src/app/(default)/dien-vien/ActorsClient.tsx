"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchActorList, getActorThumb, type ActorListItem } from "@/lib/api/actor";

function ActorAvatar({ item, cdn }: { item: ActorListItem; cdn: string }) {
  const photo = item.thumb_url ? getActorThumb(item.thumb_url, cdn) : null;
  const initials = item.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={`/dien-vien/${item.slug}`} className="group block text-center">
      <div className="relative mx-auto w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-white/10 mb-2">
        {photo ? (
          <img
            src={photo}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-white/30 select-none">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <p className="text-[13px] font-medium text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-2 transition-colors leading-snug">
        {item.name}
      </p>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i}>
          <div className="w-full aspect-square rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
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
      >‹ Trước</button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`el-${i}`} className="px-2 text-gray-400 dark:text-white/40">…</span>
        ) : (
          <button
            key={page}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              current === page
                ? "bg-[#f472b6] text-white"
                : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20"
            }`}
            onClick={() => onChange(page as number)}
            disabled={current === page}
          >{page}</button>
        )
      )}
      <button
        className="px-3 py-1.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-30 text-sm transition-colors"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >Sau ›</button>
    </div>
  );
}

export default function ActorsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const [items, setItems] = useState<ActorListItem[]>([]);
  const [cdn, setCdn] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchActorList(pageParam).then((res) => {
      if (cancelled) return;
      setItems(res?.items ?? []);
      setCdn(res?.cdnImage ?? "");
      setTotalItems(res?.totalItems ?? 0);
      setTotalPages(res?.totalPages ?? 1);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [pageParam]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/dien-vien?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16 3xl:max-w-[2400px] 4xl:max-w-[3200px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-[10px] mb-6">
        <div>
          <h1 className="text-[22px] leading-[32px] font-bold text-gray-900 dark:text-white/90 m-0">
            Diễn Viên
          </h1>
          {!loading && totalItems > 0 && (
            <p className="text-sm text-gray-500 dark:text-white/35 mt-0.5">
              {totalItems.toLocaleString()} diễn viên
            </p>
          )}
        </div>
      </div>

      {loading && <SkeletonGrid />}

      {!loading && items.length === 0 && (
        <div className="flex items-center justify-center min-h-[30vh] text-gray-400 dark:text-white/40">
          Không tìm thấy diễn viên nào.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {items.map((item, i) => (
            <ActorAvatar key={`${item.slug}-${i}`} item={item} cdn={cdn} />
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <Paginator current={pageParam} total={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}
