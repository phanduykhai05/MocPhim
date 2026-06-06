"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchActorMovies, getActorThumb, type ActorMovie } from "@/lib/api/actor";
import { fetchMoviePeoples } from "@/lib/api/movie";
import MoviePoster from "@/components/MoviePoster";
import images from "@/assets/images";

const PAGE_SIZE = 24;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Movie Card ────────────────────────────────────────────────────────────────

function MovieCard({ item, cdn, priority = false }: { item: ActorMovie; cdn: string; priority?: boolean }) {
  const thumb = getActorThumb(item.thumb_url, cdn);
  return (
    <div className="group w-full">
      <div className="relative w-full rounded-[6px] overflow-hidden bg-gray-200 dark:bg-[#25252b]" style={{ paddingTop: "135.74%" }}>
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
            <Image src={images.logo} alt="MócPhim" width={56} height={20} className="h-auto w-[56px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          </span>

          {(item.episode_current || item.quality) && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[10] flex items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
              {item.episode_current && (
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: "#5e6070" }}>
                  <span style={{ fontWeight: 200 }}>PĐ.</span>
                  <strong style={{ fontWeight: 200 }}>{item.episode_current}</strong>
                </div>
              )}
              {item.quality && (
                <div className="flex items-center gap-1 px-2 py-[0.2rem] text-[11px] font-normal text-white" style={{ backgroundColor: "#2ca35d" }}>
                  <span style={{ fontWeight: 200 }}>TM.</span>
                  <strong style={{ fontWeight: 200 }}>{item.quality}</strong>
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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-x-4 gap-y-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i}>
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
      <button className="px-3 py-1.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-30 text-sm transition-colors" onClick={() => onChange(current - 1)} disabled={current <= 1}>‹ Trước</button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`el-${i}`} className="px-2 text-gray-400 dark:text-white/40">…</span>
        ) : (
          <button key={page} className={`w-8 h-8 rounded text-sm font-medium transition-colors ${current === page ? "bg-[#f472b6] text-white" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20"}`} onClick={() => onChange(page as number)} disabled={current === page}>{page}</button>
        )
      )}
      <button className="px-3 py-1.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-30 text-sm transition-colors" onClick={() => onChange(current + 1)} disabled={current >= total}>Sau ›</button>
    </div>
  );
}

// ─── Actor Sidebar ─────────────────────────────────────────────────────────────

function ActorSidebar({ name, slug, photoUrl }: { name: string; slug: string; photoUrl: string | null }) {
  const initials = name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="w-full lg:w-[220px] shrink-0 flex flex-col items-center lg:items-start gap-4">
      <div className="w-[160px] lg:w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/10 shadow-lg">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-white/30 select-none">
            {initials}
          </div>
        )}
      </div>

      <div className="text-center lg:text-left w-full">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3">{name}</h1>

        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-pink-100 dark:bg-white/10 text-pink-600 dark:text-white/70 hover:bg-pink-200 dark:hover:bg-white/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            Yêu thích
          </button>
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
            Chia sẻ
          </button>
        </div>
      </div>

      <div className="w-full text-sm text-gray-600 dark:text-white/60 space-y-2 border-t border-gray-200 dark:border-white/10 pt-4">
        <div>
          <span className="text-gray-400 dark:text-white/40">Tên gọi khác:</span>
          <p className="text-gray-700 dark:text-white/70 mt-0.5">Đang cập nhật</p>
        </div>
        <div>
          <span className="text-gray-400 dark:text-white/40">Giới thiệu:</span>
          <p className="text-gray-700 dark:text-white/70 mt-0.5 line-clamp-4">Đang cập nhật</p>
        </div>
        <div className="flex gap-4">
          <div><span className="text-gray-400 dark:text-white/40">Giới tính:</span> <span className="text-gray-700 dark:text-white/70">Đang cập nhật</span></div>
        </div>
        <div><span className="text-gray-400 dark:text-white/40">Ngày sinh:</span> <span className="text-gray-700 dark:text-white/70 ml-1">Đang cập nhật</span></div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ActorDetailClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const [items, setItems] = useState<ActorMovie[]>([]);
  const [cdn, setCdn] = useState("");
  const [actorName, setActorName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchActorMovies(slug, { page: pageParam, size: PAGE_SIZE, sort_field: "modified_time", sort_type: "desc" }).then(async (res) => {
      if (cancelled) return;
      setItems(res?.items ?? []);
      setCdn(res?.cdnImage ?? "");
      setActorName(res?.actorName ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
      setTotalItems(res?.totalItems ?? 0);
      setTotalPages(res?.totalPages ?? 1);
      setLoading(false);

      // Try to get actor photo from peoples data of first movie
      const firstSlug = res?.items?.[0]?.slug;
      if (firstSlug && !cancelled) {
        const peoples = await fetchMoviePeoples(firstSlug);
        if (!cancelled && peoples) {
          const actorSlugNorm = slug.replace(/-/g, "");
          const matched = peoples.peoples.find((p) => {
            const nameSlug = slugify(p.name).replace(/-/g, "");
            const origSlug = slugify(p.original_name || "").replace(/-/g, "");
            return nameSlug === actorSlugNorm || origSlug === actorSlugNorm;
          });
          if (matched?.profile_path) {
            setPhotoUrl(`${peoples.profile_sizes.w185}${matched.profile_path}`);
          }
        }
      }
    });
    return () => { cancelled = true; };
  }, [slug, pageParam]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/dien-vien/${slug}?${params.toString()}`);
  };

  const displayName = actorName || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-5 lg:pt-20 pt-16 3xl:max-w-[2400px] 4xl:max-w-[3200px]">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-white/40 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/dien-vien" className="hover:text-gray-900 dark:hover:text-white transition-colors">Diễn viên</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-white/70">{displayName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <ActorSidebar name={displayName} slug={slug} photoUrl={photoUrl} />

        {/* Movies section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
              Các phim đã tham gia
              {!loading && totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400 dark:text-white/40">
                  ({totalItems.toLocaleString()} phim)
                </span>
              )}
            </h2>
          </div>

          {loading && <SkeletonGrid />}

          {!loading && items.length === 0 && (
            <div className="flex items-center justify-center min-h-[30vh] text-gray-400 dark:text-white/40">
              Chưa có phim nào.
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-3">
              {items.map((item, i) => (
                <MovieCard key={item._id} item={item} cdn={cdn} priority={i < 6} />
              ))}
            </div>
          )}

          {totalPages > 1 && !loading && (
            <Paginator current={pageParam} total={totalPages} onChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  );
}
