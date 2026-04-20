import React from 'react';
import { MovieActionBar } from '@/app/(default)/phim/[slug]/components/Hero/components/MovieActionBar';
import { MovieTabs } from '@/app/(default)/phim/[slug]/components/Hero/components/MovieTabs';
import { AvailableVersions } from '@/app/(default)/phim/[slug]/components/Hero/components/AvailableVersions';
import { CommentSection } from '@/app/(default)/phim/[slug]/components/Hero/components/CommentSection';

export const MovieMainContent = () => {
  return (
    <div className="flex-grow flex flex-col bg-[#191b24]/60 backdrop-blur-[20px] rounded-2xl lg:rounded-[3rem_1.25rem_1.25rem_1.25rem] overflow-hidden lg:ml-[-33px] ml-0">
      
      {/* 1. Thanh Hành động (Xem, Like, Share) */}
      <MovieActionBar />

      {/* 2. Khoảng trống nội dung chính */}
      <div className="flex flex-col pb-10">
        
        {/* Thanh Tabs */}
        <MovieTabs />

        {/* Khu vực Các bản chiếu */}
        <AvailableVersions />

        {/* Phân cách mỏng (Ngoại lai nếu cần) */}
        <hr className="border-white/5 mx-6 lg:mx-10" />

        {/* Khu vực Comment */}
        <CommentSection />

      </div>
    </div>
  );
};

export default MovieMainContent;