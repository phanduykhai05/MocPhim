"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      // Mặc định dark mode, chỉ chuyển sang light nếu người dùng đã chọn
      const isDark = localStorage.theme !== 'light';
      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      // Ignore storage or media-query access errors in restricted environments.
    }
  }, []);

  return null;
}
