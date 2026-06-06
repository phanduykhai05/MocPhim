"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavigationScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    // After navigation, isMounted-gated components (e.g. Swiper) re-render async.
    // Dispatch scroll after they settle so the browser re-evaluates lazy images in viewport.
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setTimeout(() => window.dispatchEvent(new Event("scroll")), 200);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
