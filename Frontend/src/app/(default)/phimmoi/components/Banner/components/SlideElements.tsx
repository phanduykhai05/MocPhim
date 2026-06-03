"use client";

import React from 'react';
import Link from 'next/link';
import { App } from 'antd';
import { Movie } from '@/app/(default)/phimmoi/components/Banner/components/data/movie';
import { useAuth } from '@/contexts/AuthContext';
import { apiAddBookmark, apiDeleteBookmark, apiIsBookmarked } from '@/lib/api/bookmarks';
import s from '../style.module.scss';

const SlideElements = ({ movie, priority = false }: { movie: Movie; priority?: boolean }) => {
  const { user } = useAuth();
  const { message } = App.useApp();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false);
  React.useEffect(() => {
    if (!user || !movie.id) return;
    apiIsBookmarked(user.id, movie.id).then(setIsFavorite).catch(() => {});
  }, [user, movie.id]);

  const handleToggleFavorite = async () => {
    if (!user) { message.warning('Bạn cần đăng nhập để sử dụng tính năng này'); return; }
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isFavorite) {
        await apiDeleteBookmark(user.id, movie.id);
        setIsFavorite(false);
        message.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await apiAddBookmark(movie.slug);
        setIsFavorite(true);
        message.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const slugifyGenre = (name: string) =>
    name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/\s+/g, '-');
  const mobilePoster = movie.thumb || movie.poster;

  return (
    <div className="relative w-full h-[560px] md:h-[680px] xl:h-[760px] overflow-hidden">

      {/* 1. Dotted pattern overlay */}
      <div className={s.dottedOverlay} />

      {/* 2. Blurred background */}
      <div
        className={`${s.backgroundFade} md:hidden`}
        style={{ backgroundImage: `url('${mobilePoster}')` }}
      />
      <div
        className={`${s.backgroundFade} hidden md:block`}
        style={{ backgroundImage: `url('${movie.poster}')` }}
      />

      {/* 3. Cover fade — top/bottom mask */}
      <div className={s.coverFade}>
        {/* 4. Cover image — left/right mask */}
        <div className={s.coverImage}>
          <picture>
            <source media="(min-width: 768px)" srcSet={movie.poster} />
            <img
              src={mobilePoster}
              alt={movie.title}
              className={s.coverImg}
              loading={priority ? 'eager' : 'lazy'}
            />
          </picture>
        </div>
      </div>

      {/* 5. Safe area — content at bottom */}
      <div className={s.safeArea}>
        <div className={s.safeAreaInner}>
          <div className={s.slideContent}>

            {/* Tên phim */}
            <h2 className={s.mediaTitle}>{movie.title}</h2>

            {/* Tên gốc */}
            {movie.alias && (
              <h3 className={s.mediaAlias}>{movie.alias}</h3>
            )}

            {/* Tags hàng 1 */}
            <div className={s.hlTags}>
              {movie.imdbScore && movie.imdbScore > 0 && (
                <span className={s.tagImdb}>{movie.imdbScore.toFixed(1)}</span>
              )}
              {movie.quality && (
                <span className={s.tagQuality}>{movie.quality}</span>
              )}
              {movie.ageRating && (
                <span className={s.tagModel}>{movie.ageRating}</span>
              )}
              {movie.year && (
                <span className={s.tagClassic}>{movie.year}</span>
              )}
              {movie.status && (
                <span className={s.tagClassic}>{movie.status}</span>
              )}
            </div>

            {/* Tags hàng 2 — Thể loại */}
            {movie.genres.length > 0 && (
              <div className={`${s.hlTags} mb-4`}>
                {movie.genres.slice(0, 5).map((g) => (
                  <Link
                    key={g}
                    href={`/the-loai/${slugifyGenre(g)}`}
                    className={s.tagTopic}
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Mô tả */}
            {movie.description && (
              <div className={s.description}>
                <p>{movie.description}</p>
              </div>
            )}

            {/* Nút hành động */}
            <div className={s.touch}>
              {/* Play */}
              <Link
                href={`/xem-phim/${movie.slug}`}
                className={s.buttonPlay}
                aria-label={`Xem phim ${movie.title}`}
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                </svg>
              </Link>

              {/* Touch group: Bookmark + Info */}
              <div className={s.touchGroup}>
                {/* Bookmark */}
                <button
                  type="button"
                  className={s.touchItem}
                  aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  onClick={handleToggleFavorite}
                  disabled={bookmarkLoading}
                >
                  <svg
                    viewBox="0 0 24 24"
                    height="20" width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFavorite ? '#ff4d6d' : 'none'}
                    stroke={isFavorite ? '#ff4d6d' : 'currentColor'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                {/* Info */}
                <Link href={`/phim/${movie.slug}`} className={s.touchItem} aria-label={`Thông tin ${movie.title}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <g clipPath="url(#ci)">
                      <path d="M10 0.75C4.477 0.75 0 5.227 0 10.75s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm1.266 14.202a1.266 1.266 0 01-2.532 0V9.886a1.266 1.266 0 012.532 0v5.066zM10 7.814a1.266 1.266 0 110-2.532 1.266 1.266 0 010 2.532z" fill="currentColor" />
                    </g>
                    <defs><clipPath id="ci"><rect width="20" height="20" fill="white" transform="translate(0 0.75)"/></clipPath></defs>
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideElements;
