"use client";

import { useRef, useState, useCallback, useEffect, cloneElement, Children, isValidElement } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

const EXIT_MS = 180;
const HIDE_DELAY = 120;

type BadgeType = "pd" | "lt" | "tm";
const BADGE_LABEL: Record<BadgeType, string> = { pd: "Vietsub", tm: "Thuyết minh", lt: "Lồng tiếng" };
const BADGE_COLOR: Record<BadgeType, string> = { pd: "#4b5060", tm: "#2ca35d", lt: "#6366f1" };

export interface HoverMovie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  quality: string;
  lang: string;
  year: number;
  episode_current: string;
  badges: { type: BadgeType; text: string }[];
}

interface PopupState {
  movie: HoverMovie;
  top: number;
  left: number;
  width: number;
  phase: "in" | "out";
}

/* ─── Popup ─────────────────────────────────────────────────────────────── */

function Popup({
  state,
  onMouseEnter,
  onMouseLeave,
}: {
  state: PopupState;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { movie, top, left, width, phase } = state;
  const posterH = Math.round(width * 0.5625);

  const animation =
    phase === "in"
      ? "mhp-enter 0.22s cubic-bezier(0.16,1,0.3,1) forwards"
      : "mhp-exit 0.18s ease forwards";

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: Math.min(width, 450),
        zIndex: 9999,
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 5px 10px 0 rgba(0,0,0,0.2)",
        color: "#fff",
        lineHeight: 1.5,
        animation,
        transformOrigin: "top center",
        pointerEvents: "none", /* ← không block swiper */
        fontFamily: "inherit",
      }}
    >
      {/* ── Poster — pass-through ── */}
      <div style={{ height: posterH, position: "relative", overflow: "hidden", background: "#252836" }}>
        <img
          src={movie.thumb_url}
          alt={movie.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 40%, rgba(37,40,54,0.97) 100%)",
        }} />
      </div>

      {/* ── Content — interactive ── */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ background: "#252836", padding: "10px 13px 13px", pointerEvents: "auto" }}
      >

        {/* Titles */}
        <p style={{ margin: "0 0 1px", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {movie.name}
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#e2a838", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {movie.origin_name}
        </p>

        {/* ── Buttons ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "stretch" }}>
          {/* Xem ngay */}
          <Link
            href={`/xem-phim/${movie.slug}`}
            style={{
              flex: 1, minWidth: 0,
              background: "linear-gradient(135deg,#f5c842,#fde98a)",
              color: "#1a1400",
              borderRadius: 7,
              height: 34,
              fontWeight: 700,
              fontSize: 12.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              textDecoration: "none",
            }}
          >
            <svg fill="currentColor" viewBox="0 0 384 512" height="10" width="10">
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
            Xem ngay
          </Link>

          {/* Yêu thích */}
          <BookmarkButton
            movieId={movie._id}
            slug={movie.slug}
            showLabel
            className="flex items-center justify-center gap-1.5 px-2.5 rounded-[7px] bg-white/8 hover:bg-white/15 transition-colors border border-white/12 text-white text-[12px] font-medium shrink-0 disabled:opacity-50 h-[34px] whitespace-nowrap"
          />

          {/* Chi tiết */}
          <Link
            href={`/phim/${movie.slug}`}
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 7,
              height: 34,
              padding: "0 10px",
              fontSize: 12.5,
              display: "flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <svg fill="currentColor" viewBox="0 0 20 21" height="12" width="12">
              <path d="M10 .75C4.477.75 0 5.227 0 10.75s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm1.266 14.202a1.266 1.266 0 11-2.532 0V9.636a1.266 1.266 0 112.532 0v5.066zM10 7.814a1.266 1.266 0 110-2.532 1.266 1.266 0 010 2.532z" />
            </svg>
            Chi tiết
          </Link>
        </div>

        {/* ── Tags ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
          {movie.quality && <Tag border="#e2b83a" color="#e2b83a">{movie.quality}</Tag>}
          {movie.year > 0 && <Tag>{movie.year}</Tag>}
          {movie.episode_current && <Tag>{movie.episode_current}</Tag>}
        </div>

        {/* ── Lang badges ── */}
        {movie.badges.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {movie.badges.map((b) => (
              <span
                key={b.type}
                style={{
                  background: BADGE_COLOR[b.type],
                  borderRadius: 4,
                  fontSize: 10.5,
                  padding: "2px 6px",
                  color: "#fff",
                  fontWeight: 500,
                  lineHeight: "18px",
                }}
              >
                {BADGE_LABEL[b.type]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ children, color = "#d0d8ee", border = "rgba(255,255,255,0.18)" }: {
  children: React.ReactNode;
  color?: string;
  border?: string;
}) {
  return (
    <span style={{
      color,
      background: "rgba(255,255,255,0.06)",
      border: `1px solid ${border}`,
      borderRadius: 4,
      fontSize: 10.5,
      padding: "1px 6px",
      lineHeight: "20px",
      display: "inline-flex",
      alignItems: "center",
      fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

/* ─── Wrapper ───────────────────────────────────────────────────────────── */

export default function MovieHoverPopup({
  movie,
  children,
}: {
  movie: HoverMovie;
  children: React.ReactNode;
}) {
  const elemRef = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<PopupState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
  }, []);

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (window.innerWidth < 1024) return;
    const el = elemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = window.scrollX, sy = window.scrollY, vpW = window.innerWidth;
    const popupW = Math.min(Math.max(rect.width, 252), 450);
    let left = rect.left + sx + rect.width / 2 - popupW / 2;
    left = Math.max(sx + 6, Math.min(left, sx + vpW - popupW - 6));
    setState({ movie, top: rect.top + sy, left, width: popupW, phase: "in" });
  }, [movie]);

  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setState((prev) => prev ? { ...prev, phase: "out" } : null);
      exitTimer.current = setTimeout(() => setState(null), EXIT_MS);
    }, HIDE_DELAY);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setState((prev) => prev ? { ...prev, phase: "in" } : null);
  }, []);

  // Inject handlers trực tiếp vào child — không thêm wrapper div
  const child = Children.only(children);
  if (!isValidElement(child)) return <>{children}</>;

  const injected = cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>, {
    ref: (node: HTMLElement | null) => {
      elemRef.current = node;
      const orig = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof orig === "function") orig(node);
      else if (orig && typeof orig === "object") (orig as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      show();
      (child.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hide();
      (child.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(e);
    },
  });

  return (
    <>
      {injected}
      {mounted && state && createPortal(
        <Popup state={state} onMouseEnter={cancelHide} onMouseLeave={hide} />,
        document.body,
      )}
    </>
  );
}
