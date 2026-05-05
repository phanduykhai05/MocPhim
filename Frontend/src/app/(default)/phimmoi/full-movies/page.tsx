"use client";

import React, { useState } from "react";
import { NewUpdateCard } from "@/app/(default)/phimmoi/components/MovieUpdate/components/NewUpdateCard";
import { FALLBACK_MOVIES } from "@/app/(default)/phimmoi/components/MovieUpdate";

const FullMoviesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const MOVIES_PER_PAGE = 16;
  const totalPages = Math.ceil(FALLBACK_MOVIES.length / MOVIES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedList = FALLBACK_MOVIES.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center mt-[10px] mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-white/90 m-0 flex items-center gap-2">
          <span>Danh sách phim</span>
        </h4>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-2">
        {paginatedList.map((movie, index) => (
          <NewUpdateCard key={movie.slug} {...movie} priority={index < 4} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-white/80 text-black font-bold" : "bg-white/20 text-white"}`}
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FullMoviesPage;