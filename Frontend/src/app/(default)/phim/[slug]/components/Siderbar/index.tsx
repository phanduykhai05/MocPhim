import React from 'react';
import { MovieDetailInfo } from '@/app/(default)/phim/[slug]/components/Siderbar/components/MovieDetailInfo';
import { TopWeeklyMovies } from '@/app/(default)/phim/[slug]/components/Siderbar/components/TopWeeklyMovies';

export const Sidebar = () => {
  return (
    <div className="w-full lg:w-[440px] shrink-0 flex flex-col p-6 lg:p-10 
                    bg-transparent lg:bg-[#191b24]/60 
                    lg:backdrop-blur-[40px] 
                    rounded-2xl lg:rounded-[1.25rem_3rem_1.25rem_1.25rem]
                    border-none lg:border lg:border-white/5"> 
      
      {/* Thông tin phim */}
      <MovieDetailInfo />
      
      {/* Top phim tuần - Ẩn trên Mobile */}
      <div className="hidden lg:block">
        <hr className="my-8 border-white/10" />
        <TopWeeklyMovies />
      </div>

    </div>
  );
};

export default Sidebar;