"use client";

import { useState, useEffect } from "react";

export default function FooterBottom() {
    const currentYear = new Date().getFullYear();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className="mt-6 xl:mt-auto w-full flex items-center justify-center xl:self-end">
                <div className="text-[13px] text-[#63677a] text-center w-full">
                    © {currentYear} MocPhim. All rights reserved.
                </div>
            </div>
            
            {/* Luôn render button nhưng kiểm soát hiển thị bằng CSS.
              Dùng pointer-events-none để không bấm nhầm khi nó đang ẩn.
            */}
            <button
                onClick={handleScrollTop}
                aria-label="Lên đầu trang"
                className={`
                    fixed right-6 w-[64px] h-[64px] flex flex-col items-center justify-center gap-0.5 
                    bg-white rounded-2xl text-black shadow-xl hover:bg-gray-200 z-50
                    transition-all duration-500 ease-out
                    ${showScrollTop 
                        ? "bottom-6 opacity-100 translate-y-0 pointer-events-auto" 
                        : "bottom-6 opacity-0 translate-y-10 pointer-events-none"
                    }
                `}
            >
                {/* Icon mũi tên nét dày giống ảnh */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                    />
                </svg>
                
                {/* Chữ in đậm và chia làm 2 dòng */}
                <span className="text-[10px] font-bold uppercase leading-tight text-center tracking-wide">
                    Đầu <br /> Trang
                </span>
            </button>
        </>
    );
}