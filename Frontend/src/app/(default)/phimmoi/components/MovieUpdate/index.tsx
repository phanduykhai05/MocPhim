import React from "react";
import { NewUpdateCard, type BadgeItem } from "@/app/(default)/phimmoi/components/MovieUpdate/components/NewUpdateCard";

export interface UpdateMovie {
  title: string;
  originName?: string;
  slug: string;
  thumb: string;
  badges: BadgeItem[];
}

interface NewUpdateListProps {
  movies: UpdateMovie[];
}

export const NewUpdateList = ({ movies }: NewUpdateListProps) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full max-w-[1808px] mx-auto px-4 md:px-[60px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[100px] 4xl:px-[160px] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center mt-[10px] mb-4">
        <h4 className="text-[22px] leading-[32px] font-bold text-gray-900 dark:text-white/90 m-0 flex items-center gap-2">
          <a
            href="/phimmoi/full-movies"
            className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-white transition-colors"
            style={{ cursor: "pointer" }}
          >
            <span className="text-gray-900 dark:text-white text-[22px]">Mới Update</span>
            <span className="text-sm font-normal text-gray-500 dark:text-white/50 ml-2 flex items-center gap-1">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </h4>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-x-4 gap-y-2">
        {movies.map((movie, index) => (
          <NewUpdateCard key={movie.slug} {...movie} priority={index < 4} />
        ))}
      </div>
    </div>
  );
};

export default NewUpdateList;

