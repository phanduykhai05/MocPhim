"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategories, fetchCountries, fetchYears } from "@/lib/api/movie";
import { useRouter } from "next/navigation";

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [cntLoading, setCntLoading] = useState(true);
  const [yearLoading, setYearLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    fetchCategories().then((data) => {
      setCategories(data);
      setCatLoading(false);
    });
    fetchCountries().then((data) => {
      setCountries(data);
      setCntLoading(false);
    });
    fetchYears().then((data) => {
      const normalized = (data as unknown[])
        .map((v) => {
          if (typeof v === "number" || typeof v === "string") return String(v);
          if (v && typeof v === "object") {
            const obj = v as Record<string, unknown>;
            const candidate = obj.year ?? obj.name ?? obj.slug ?? obj.value ?? obj.id;
            if (typeof candidate === "number" || typeof candidate === "string") return String(candidate);
          }
          return "";
        })
        .filter((year) => /^\d{4}$/.test(year));
      const uniqueSortedYears = Array.from(new Set(normalized)).sort((a, b) => Number(b) - Number(a));
      setYears(uniqueSortedYears.map((year) => ({ id: year, name: year, slug: year })));
      setYearLoading(false);
    });
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`absolute top-0 left-0 h-full w-[85vw] max-w-xs bg-[#191b24] shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span className="text-lg font-bold text-white">Danh mục</span>
          <button onClick={onClose} aria-label="Đóng menu" className="text-white text-2xl px-2">×</button>
        </div>
        <nav className="flex flex-col gap-2 px-4 py-4 text-white text-base">
          <Link href="/phim-le" className="py-2 hover:text-[#FFD875]" onClick={onClose}>Phim Lẻ</Link>
          <Link href="/phim-bo" className="py-2 hover:text-[#FFD875]" onClick={onClose}>Phim Bộ</Link>
          <div>
            <div className="font-semibold mb-1">Thể loại</div>
            <div className="flex flex-wrap gap-2">
              {catLoading ? (
                <span className="text-xs text-white/40">Đang tải...</span>
              ) : categories.length === 0 ? (
                <span className="text-xs text-white/40">Không có dữ liệu</span>
              ) : (
                categories.slice(0, 12).map((cat) => (
                  <Link key={cat.slug} href={`/the-loai/${cat.slug}`} className="bg-white/10 rounded px-2 py-1 text-xs hover:bg-[#FFD875] hover:text-[#191b24]" onClick={onClose}>{cat.name}</Link>
                ))
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="font-semibold mb-1">Năm phát hành</div>
            <div className="flex flex-wrap gap-2">
              {yearLoading ? (
                <span className="text-xs text-white/40">Đang tải...</span>
              ) : years.length === 0 ? (
                <span className="text-xs text-white/40">Không có dữ liệu</span>
              ) : (
                years.slice(0, 10).map((y) => (
                  <Link key={y.slug} href={`/nam-phat-hanh/${y.slug}`} className="bg-white/10 rounded px-2 py-1 text-xs hover:bg-[#FFD875] hover:text-[#191b24]" onClick={onClose}>{y.name}</Link>
                ))
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="font-semibold mb-1">Quốc gia</div>
            <div className="flex flex-wrap gap-2">
              {cntLoading ? (
                <span className="text-xs text-white/40">Đang tải...</span>
              ) : countries.length === 0 ? (
                <span className="text-xs text-white/40">Không có dữ liệu</span>
              ) : (
                countries.slice(0, 10).map((c) => (
                  <Link key={c.slug} href={`/quoc-gia/${c.slug}`} className="bg-white/10 rounded px-2 py-1 text-xs hover:bg-[#FFD875] hover:text-[#191b24]" onClick={onClose}>{c.name}</Link>
                ))
              )}
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default MobileMenu;
