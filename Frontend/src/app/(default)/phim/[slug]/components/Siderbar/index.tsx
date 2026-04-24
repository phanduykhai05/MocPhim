import React from 'react';
import { MovieDetailInfo } from '@/app/(default)/phim/[slug]/components/Siderbar/components/MovieDetailInfo';
import { TopWeeklyMovies } from '@/app/(default)/phim/[slug]/components/Siderbar/components/TopWeeklyMovies';
import { MovieActors } from '@/app/(default)/phim/[slug]/components/Siderbar/components/MovieActors';
import { MovieItem, PeoplesData, MovieListItem } from '@/lib/api/movie';

interface SidebarProps {
  movie: MovieItem;
  cdnImage: string;
  peoples: PeoplesData | null;
  topMovies: { items: MovieListItem[]; cdnImage: string } | null;
}

export const Sidebar = ({ movie, cdnImage, peoples, topMovies }: SidebarProps) => {
  const profileBase = peoples?.profile_sizes?.w185 ?? 'https://image.tmdb.org/t/p/w185';

  return (
    <div className="w-full lg:w-[440px] shrink-0 flex flex-col p-6 lg:p-10
                    bg-transparent lg:bg-[#191b24]/60
                    lg:backdrop-blur-[40px]
                    rounded-2xl lg:rounded-[1.25rem_3rem_1.25rem_1.25rem]
                    border-none lg:border lg:border-white/5
                    mt-[-180px]">

      <MovieDetailInfo movie={movie} cdnImage={cdnImage} />
      <MovieActors peoples={peoples?.peoples ?? null} profileBase={profileBase} actors={movie.actor} />

      <div className="hidden lg:block">
        <hr className="my-8 border-white/10" />
        <TopWeeklyMovies movies={topMovies?.items ?? []} cdnImage={topMovies?.cdnImage ?? cdnImage} />
      </div>
    </div>
  );
};

export default Sidebar;