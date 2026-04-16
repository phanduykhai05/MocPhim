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
            <div className="flex mt-6 xl:mt-0 flex-col gap-4 xl:flex-row xl:gap-0 justify-center md:justify-between xl:justify-end w-full items-center">
                <div className="text-[13px] text-[#63677a]">
                    © {currentYear} MocPhim. All rights reserved.
                </div>
            </div>
            {showScrollTop && (
                <button
                    onClick={handleScrollTop}
                    aria-label="Lên đầu trang"
                    className="fixed bottom-6 right-6 w-11 h-11 flex items-center justify-center bg-[#1a1e29] border border-[#2d3142] rounded-lg text-[#a0a4b8] hover:text-white hover:bg-[#2d3142] transition-colors z-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
                        />
                    </svg>
                </button>
            )}
        </>
    );
}
