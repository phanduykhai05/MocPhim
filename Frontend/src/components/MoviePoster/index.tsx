"use client";

import { useState } from "react";
import Image from "next/image";

interface MoviePosterProps {
  src: string;
  alt: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "auto" | "low";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  className?: string;
  style?: React.CSSProperties;
}

export default function MoviePoster({
  src,
  alt,
  className = "absolute inset-0 w-full h-full object-cover",
  style,
  ...props
}: MoviePosterProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-[#1e2030] gap-1.5 px-2">
        <svg className="w-8 h-8 text-gray-400 dark:text-white/25 opacity-70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 10.5h18M3 3.75h18" />
        </svg>
        <p className="text-[9px] text-center text-gray-400 dark:text-white/30 leading-snug">
          ảnh server gặp<br />1 chút vấn đề
        </p>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-white/10 rounded-[inherit]" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={style}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </>
  );
}
