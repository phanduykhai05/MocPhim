"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategories, fetchCountries, fetchYears } from "@/lib/api/movie";

interface NavItem {
  id: string;
  name: string;
  slug: string;
}

const ChevronDown = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
  </svg>
);

function DropdownMenu({
  label,
  items,
  basePath,
  loading,
}: {
  label: string;
  items: NavItem[];
  basePath: string;
  loading: boolean;
}) {
  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center gap-1 hover:text-gray-300 transition-colors select-none">
        {label}
        <ChevronDown />
      </div>

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-2 w-[580px] bg-[#1a1c24] border border-gray-800 rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
        {loading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-2">Không có dữ liệu</p>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {items.map((item, index) => (
              <Link
                key={`${basePath}-${item.slug}-${index}`}
                href={`/${basePath}/${item.slug}`}
                className="text-sm text-gray-300 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded transition-colors truncate"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Navigation = () => {
  const [categories, setCategories] = useState<NavItem[]>([]);
  const [countries, setCountries] = useState<NavItem[]>([]);
  const [years, setYears] = useState<NavItem[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [cntLoading, setCntLoading] = useState(true);
  const [yearLoading, setYearLoading] = useState(true);

  const normalizeYear = (value: unknown): string => {
    if (typeof value === "number" || typeof value === "string") return String(value);
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const candidate = obj.year ?? obj.name ?? obj.slug ?? obj.value ?? obj.id;
      if (typeof candidate === "number" || typeof candidate === "string") return String(candidate);
    }
    return "";
  };

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data.filter((cat) => cat.slug !== 'phim-18'));
      setCatLoading(false);
    });
    fetchCountries().then((data) => {
      setCountries(data);
      setCntLoading(false);
    });
    fetchYears().then((data) => {
      const normalized = (data as unknown[])
        .map(normalizeYear)
        .filter((year) => /^\d{4}$/.test(year));

      const uniqueSortedYears = Array.from(new Set(normalized)).sort((a, b) => Number(b) - Number(a));

      setYears(
        uniqueSortedYears.map((year) => ({
          id: year,
          name: year,
          slug: year,
        }))
      );
      setYearLoading(false);
    });
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-4 text-white text-[13px] font-medium">
      {/* <Link href="/chu-de" className="hover:text-gray-300 transition-colors capitalize">Chủ Đề</Link> */}

      <DropdownMenu label="Thể loại" items={categories} basePath="the-loai" loading={catLoading} />
      <DropdownMenu label="Năm phát hành" items={years} basePath="nam-phat-hanh" loading={yearLoading} />

      <Link href="/phim-le" className="text-white no-underline hover:text-gray-300 transition-colors capitalize">Phim Lẻ</Link>
      <Link href="/phim-bo" className="text-white no-underline hover:text-gray-300 transition-colors capitalize">Phim Bộ</Link>

      <DropdownMenu label="Quốc gia" items={countries} basePath="quoc-gia" loading={cntLoading} />

      <Link href="/dien-vien" className="text-white no-underline hover:text-gray-300 transition-colors capitalize">Diễn Viên</Link>
      {/* <Link href="/lich-chieu" className="hover:text-gray-300 transition-colors capitalize">Lịch Chiếu</Link> */}
    </nav>
  );
};

export default Navigation;
