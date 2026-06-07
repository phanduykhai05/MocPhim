"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { ArrowLeft, Flag, Heart, ListVideo, Maximize, Plus, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiAddBookmark, apiDeleteBookmark, apiIsBookmarked } from "@/lib/api/bookmarks";
import { apiUpdateProgress, apiGetAllProgress } from "@/lib/api/progress";
import { apiRecordView } from "@/lib/api/views";
import { useEffect, useCallback } from "react";

type VideoPlayerProps = {
  movieSlug: string;
  movieId: string;
  movieTitle: string;
  episode: number;
  server: number;
  embedUrl: string;
  hasTapParam: boolean;
};

export default function VideoPlayer({ movieSlug, movieId, movieTitle, episode, server, embedUrl, hasTapParam }: VideoPlayerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { message } = App.useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const viewRecordedRef = useRef(false);
  const elapsedRef = useRef(0);
  const isSavingRef = useRef(false);
  const savedKeyRef = useRef(""); // tránh React StrictMode double-invoke

  const saveProgress = useCallback(
    (positionSeconds: number, isCompleted: boolean) => {
      if (!user || !movieId) return;
      const key = `${user.id}-${movieId}-${episode}-${positionSeconds}`;
      if (positionSeconds === 0 && savedKeyRef.current === key) return; // đã gọi rồi
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      if (positionSeconds === 0) savedKeyRef.current = key;
      apiUpdateProgress(user.id, movieId, episode, {
        slug: movieSlug,
        positionSeconds,
        isCompleted,
      }).finally(() => { isSavingRef.current = false; });
    },
    [user, movieId, episode, movieSlug]
  );

  // Bước 1: Resume — redirect về tập đang xem dở nếu không có ?tap= trong URL
  useEffect(() => {
    if (hasTapParam || !user || !movieId) return;
    apiGetAllProgress(user.id, movieId).then((list) => {
      if (list.length === 0) return;
      const latest = list.reduce((a, b) =>
        new Date(a.lastWatchedAt) > new Date(b.lastWatchedAt) ? a : b
      );
      if (latest.episodeNumber > 1) {
        router.replace(`/xem-phim/${movieSlug}?tap=${latest.episodeNumber}&sv=${server}`);
      }
    });
  }, [user, movieId, hasTapParam, movieSlug, server, router]);

  // Tự động bookmark khi bắt đầu xem (để progress hiển thị trên trang chủ)
  useEffect(() => {
    if (!user || !movieId) return;
    apiIsBookmarked(user.id, movieId).then((isAlready) => {
      if (!isAlready) {
        apiAddBookmark(movieSlug).then(() => setBookmarked(true)).catch(() => {});
      }
    }).catch(() => {});
  }, [user, movieId, movieSlug]);

  // Ghi nhận bắt đầu xem & cập nhật mỗi 60 giây
  useEffect(() => {
    if (!user || !movieId) return;
    elapsedRef.current = 0;
    saveProgress(0, false);

    const interval = setInterval(() => {
      elapsedRef.current += 60;
      saveProgress(elapsedRef.current, false);
    }, 60_000);

    return () => clearInterval(interval);
  }, [user, movieId, episode, saveProgress]);

  function handleIframeLoad() {
    if (viewRecordedRef.current) return;
    viewRecordedRef.current = true;
    apiRecordView(movieSlug).catch(() => {});
  }

  async function handleBookmark() {
    if (!user) {
      message.warning("Bạn cần đăng nhập để sử dụng tính năng này");
      return;
    }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await apiDeleteBookmark(user.id, movieId);
        setBookmarked(false);
        message.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await apiAddBookmark(movieSlug);
        setBookmarked(true);
        message.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setBookmarkLoading(false);
    }
  }

  function handleNextEpisode() {
    saveProgress(elapsedRef.current, true);
    router.replace(`/xem-phim/${movieSlug}?tap=${episode + 1}&sv=${server}`);
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      message.success("Đã sao chép liên kết");
    } catch {
      message.error("Không thể sao chép, vui lòng copy thủ công");
    }
  }

  function handleTheater() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  }

  return (
    <section className="relative z-10 w-full">
      <div className="mb-4 flex items-center gap-2 lg:px-10">
        <Link
          href={`/phim/${movieSlug}`}
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/50 text-white/90 transition hover:bg-white/10"
          aria-label="Quay lại trang phim"
        >
          <ArrowLeft size={14} />
        </Link>
        <h2 className="text-xl font-semibold text-white lg:text-2xl">Xem phim {movieTitle}</h2>
      </div>

      <div className="relative rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-video overflow-hidden rounded-t-xl bg-[#08080a]">
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-black px-4 py-4">
            <div>
              <p className="text-base font-semibold text-white">{movieTitle}</p>
              <p className="text-sm font-semibold text-white/90">Phần 1 - Tập {episode}</p>
            </div>
            <button type="button" className="mt-1 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white">
              <ListVideo size={18} />
              <span>Danh sách tập</span>
            </button>
          </div>

          {embedUrl ? (
            <iframe
              ref={iframeRef}
              id="embed-player"
              title={`${movieTitle} - Tập ${episode}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              src={embedUrl}
              onLoad={handleIframeLoad}
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              Nguồn phát đang được cập nhật.
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex h-16 w-full items-center gap-1 overflow-x-auto rounded-b-xl bg-[#08080a] px-5 text-xs text-white/90">
          {/* Yêu thích */}
          <button
            type="button"
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 transition disabled:opacity-60 hover:bg-white/10 ${bookmarked ? "text-[#f472b6]" : ""}`}
          >
            <Heart size={14} fill={bookmarked ? "currentColor" : "none"} />
            <span>{bookmarked ? "Đã thích" : "Yêu thích"}</span>
          </button>

          {/* Thêm vào */}
          <button
            type="button"
            onClick={() => message.info("Tính năng đang phát triển")}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10"
          >
            <Plus size={14} />
            <span>Thêm vào</span>
          </button>

          {/* Chuyển tập */}
          <button
            type="button"
            onClick={handleNextEpisode}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10"
          >
            <span>Chuyển tập</span>
            <span className="h-2 w-2 rounded-full bg-[#f1c84f]" />
          </button>

          {/* Rạp phim — fullscreen iframe */}
          <button
            type="button"
            onClick={handleTheater}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10"
          >
            <Maximize size={14} />
            <span>Rạp phim</span>
          </button>

          {/* Chia sẻ */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10"
          >
            <Share2 size={14} />
            <span>Chia sẻ</span>
          </button>

          <div className="flex-grow" />

          {/* Báo lỗi */}
          <button
            type="button"
            onClick={() => message.info("Cảm ơn bạn đã báo lỗi, chúng tôi sẽ kiểm tra sớm")}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10"
          >
            <Flag size={14} />
            <span>Báo lỗi</span>
          </button>
          <span className="shrink-0 text-white/50">Server {server}</span>
        </div>
      </div>
    </section>
  );
}
