"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetBookmarks, type BookmarkItem } from "@/lib/api/bookmarks";
import { getMovieThumb } from "@/lib/api/movie";
import { NewUpdateCard } from "@/app/(default)/phimmoi/components/MovieUpdate/components/NewUpdateCard";

function toNewUpdateProps(item: BookmarkItem) {
  const badges: { type: "pd" | "lt" | "tm"; text: string; label?: string }[] =
    item.latestEpisode != null
      ? [{ type: "pd", label: "Tập", text: String(item.latestEpisode) }]
      : [{ type: "pd", label: item.mediaType === "single" ? "Phim" : "Tập", text: item.mediaType === "single" ? "Lẻ" : "Bộ" }];

  return {
    title: item.movieTitle,
    slug: item.slug,
    thumb: getMovieThumb(item.posterUrl),
    badges,
  };
}

export default function BookmarkedMovies() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiGetBookmarks(user.id)
      .then(setBookmarks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user || (!loading && bookmarks.length === 0)) return null;

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] py-6 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[100px] 4xl:px-[160px]">
      <div className="flex items-center mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-gray-900 dark:text-white/90 m-0 flex items-center gap-2">
          <span className="text-[#f472b6]">♥</span>
          Phim Yêu Thích Của Bạn
        </h4>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-x-4 gap-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[6px] bg-white/5" style={{ paddingTop: "135.74%" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-x-4 gap-y-2">
          {bookmarks.slice(0, 10).map((item, idx) => (
            <NewUpdateCard key={item.id} {...toNewUpdateProps(item)} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
