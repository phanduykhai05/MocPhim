"use client";

import { useState, useRef, useEffect } from "react";
import { fetchSearch, getMovieThumb } from "@/lib/api/movie";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import MagnifierIcon from "@/components/icon/magnifier-icon";
import AuthPopup from "@/layouts/Header/components/AuthPopup";
import { useAuth } from "@/contexts/AuthContext";
import { App } from "antd";

const UserActions = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const iconRef = useRef(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [cdnImage, setCdnImage] = useState("");
  const suggestTimeout = useRef<NodeJS.Timeout | null>(null);
  const { user, isLoading, logout } = useAuth();
  const { message } = App.useApp();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    message.success("Đăng xuất thành công!");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  // Handle search suggestion fetch
  useEffect(() => {
    if (!isSearchOpen) {
      setSuggestions([]);
      return;
    }
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setSuggestLoading(true);
    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
    suggestTimeout.current = setTimeout(() => {
      fetchSearch(searchQuery.trim()).then((res) => {
        setSuggestions(res?.items?.slice(0, 8) || []);
        setCdnImage(res?.cdnImage || "");
        setSuggestLoading(false);
      });
    }, 300);
    return () => {
      if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
    };
  }, [searchQuery, isSearchOpen]);

  return (
    <>
      {/* Mobile - Search Icon Only */}
      <div className="flex lg:hidden items-center ml-auto">
        <motion.button
          ref={iconRef}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Tìm kiếm"
          className="ml-auto p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSearchOpen ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </motion.svg>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <MagnifierIcon size={22} color="white" strokeWidth={1.5} />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Desktop - Search & Member Button */}
      <div className="hidden lg:flex items-center gap-4 ml-auto">
        {!isLoading && user ? (
          <div className="relative" ref={userMenuRef}>
            <motion.button
              aria-label="Tài khoản"
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="flex items-center justify-center gap-2 bg-[#f8f9fa] text-[#212529] py-2 px-4 rounded-full font-semibold hover:bg-[#e2e6ea] transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd875] text-sm font-bold text-[#121931]">
                {userInitial}
              </span>
              <span className="max-w-[120px] truncate text-sm">{user.name}</span>
            </motion.button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-[#22305d] bg-[#171f45] py-1 shadow-xl z-50"
                >
                  <div className="border-b border-[#22305d] px-4 py-2">
                    <p className="text-xs text-[#8f99bb]">Đăng nhập với</p>
                    <p className="truncate text-sm font-medium text-white">{user.email}</p>
                  </div>
                  {user.roles.includes("ROLE_ADMIN") && (
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm text-[#ffd875] hover:bg-[#22305d] transition-colors"
                    >
                      Quản trị
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-[#bec8e6] hover:bg-[#22305d] hover:text-white transition-colors"
                  >
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            aria-label="Đăng nhập"
            onClick={() => setIsAuthPopupOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#f8f9fa] text-[#212529] py-3 px-5 rounded-full font-semibold hover:bg-[#e2e6ea] transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"></path>
            </svg>
            <span className="text-sm">Thành viên</span>
          </motion.button>
        )}
      </div>

      {/* Mobile Search Box */}
      {isSearchOpen && (
        <div className="fixed inset-0 top-[70px] md:top-[90px] lg:hidden bg-[#191b24]/95 backdrop-blur-sm z-40">
          <div className="p-4 flex gap-2 relative">
            <input
              type="text"
              placeholder="Tìm kiếm phim, diễn viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-[#2a2d3a] text-white placeholder-[#85899b] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD875]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`;
                  setIsSearchOpen(false);
                }
              }}
            />
            <button
              aria-label="Tìm kiếm"
              className="bg-[#FFD875] text-[#191b24] px-4 py-3 rounded-lg font-semibold hover:bg-[#ffe699] transition-colors"
              onClick={() => {
                if (searchQuery.trim()) {
                  window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`;
                  setIsSearchOpen(false);
                }
              }}
            >
              Tìm kiếm
            </button>
            {/* Suggestion dropdown */}
            {searchQuery.trim() && (
              <div className="absolute left-0 top-[110%] w-full bg-[#23243a] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto border border-[#FFD875]/30">
                {suggestLoading && (
                  <div className="p-3 text-white/60 text-sm">Đang tìm kiếm...</div>
                )}
                {!suggestLoading && suggestions.length === 0 && (
                  <div className="p-3 text-white/40 text-sm">Không có gợi ý</div>
                )}
                {!suggestLoading && suggestions.map((item) => (
                  <Link
                    key={item._id}
                    href={`/phim/${item.slug}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#FFD875]/10 transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <Image
                      src={getMovieThumb(item.thumb_url, cdnImage)}
                      alt={item.name}
                      width={40}
                      height={54}
                      className="rounded w-10 h-[54px] object-cover bg-[#222]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-white text-sm font-medium">{item.name}</div>
                      {item.origin_name && (
                        <div className="truncate text-xs text-white/50">{item.origin_name}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
    </>
  );
};

export default UserActions;
