"use client";

import { useState } from "react";
import Image from "next/image";
import images from "@/assets/images";

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
}

export default function MoviePoster({
  src,
  alt,
  className = "absolute inset-0 w-full h-full object-cover",
  ...props
}: MoviePosterProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-[#1e2030] gap-2 px-2">
        <Image
          src={images.logo}
          alt="MocPhim"
          width={72}
          height={28}
          className="object-contain opacity-50"
        />
        <p className="text-[9px] text-center text-gray-400 dark:text-white/35 leading-snug">
          ảnh server gặp 1 chút vấn đề
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
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </>
  );
}
