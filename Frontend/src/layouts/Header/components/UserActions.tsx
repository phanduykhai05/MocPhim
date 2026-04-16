"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import MagnifierIcon from "@/components/icon/magnifier-icon";

const UserActions = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const iconRef = useRef(null);

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
        <motion.button
          aria-label="Đăng nhập"
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
      </div>

      {/* Mobile Search Box */}
      {isSearchOpen && (
        <div className="fixed inset-0 top-[70px] md:top-[90px] lg:hidden bg-[#191b24]/95 backdrop-blur-sm z-40">
          <div className="p-4">
            <input
              type="text"
              placeholder="Tìm kiếm phim, diễn viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#2a2d3a] text-white placeholder-[#85899b] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD875]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserActions;