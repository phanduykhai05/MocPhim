"use client";

import { useEffect, useState } from "react";
import { App } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { apiAddBookmark, apiDeleteBookmark, apiIsBookmarked } from "@/lib/api/bookmarks";

interface BookmarkButtonProps {
  movieId: string;
  slug: string;
  className?: string;
  showLabel?: boolean;
}

export default function BookmarkButton({ movieId, slug, className, showLabel = true }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { message } = App.useApp();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !movieId) return;
    apiIsBookmarked(user.id, movieId)
      .then(setBookmarked)
      .catch(() => {});
  }, [user, movieId]);

  async function toggle() {
    if (!user) {
      message.warning("Bạn cần đăng nhập để sử dụng tính năng này");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      if (bookmarked) {
        await apiDeleteBookmark(user.id, movieId);
        setBookmarked(false);
        message.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await apiAddBookmark(slug);
        setBookmarked(true);
        message.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={bookmarked ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      aria-pressed={bookmarked}
      className={className ?? "flex items-center gap-2 text-sm text-white/90 hover:text-white hover:bg-white/10 p-2.5 rounded-lg transition whitespace-nowrap select-none disabled:opacity-60"}
    >
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        style={{ color: bookmarked ? "#f472b6" : undefined }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showLabel && <span>{bookmarked ? "Đã yêu thích" : "Yêu thích"}</span>}
    </button>
  );
}
