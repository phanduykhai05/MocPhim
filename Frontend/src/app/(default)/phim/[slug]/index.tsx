import React from 'react';
import Background from '@/app/(default)/phim/[slug]/components/Backgroud';
import Sidebar from '@/app/(default)/phim/[slug]/components/Siderbar';
import Hero from '@/app/(default)/phim/[slug]/components/Hero';
import {
  MovieDetailResult,
  PeoplesData,
  MoviesImagesData,
  KeywordsData,
  MovieListItem,
  getMovieThumb,
} from '@/lib/api/movie';

interface MovieDetailTemplateProps {
  movieData: MovieDetailResult;
  peoples: PeoplesData | null;
  images: MoviesImagesData | null;
  keywords: KeywordsData | null;
  topMovies: { items: MovieListItem[]; cdnImage: string } | null;
  initialTap: number;
  initialSv: number;
}

const MovieDetailTemplatePage = ({
  movieData,
  peoples,
  images,
  keywords,
  topMovies,
  initialTap,
  initialSv,
}: MovieDetailTemplateProps) => {
  const { item, cdnImage } = movieData;
  const backdropUrl = getMovieThumb(item.poster_url || item.thumb_url, cdnImage);

  return (
    <div className='bg-[#f0f3f8] dark:bg-[#191b24] transition-colors duration-300'>
      <Background backdropUrl={backdropUrl} />
      <div className='relative z-9 pt-0 pb-10'>
        <div className='w-full max-w-[1640px] px-5 mx-auto mt-[-580px] md:mt-[-450px] relative z-3 flex flex-col lg:flex-row gap-4 lg:gap-8 justify-between items-start lg:items-stretch 3xl:max-w-[2200px] 4xl:max-w-[2800px]'>
          <div className='w-full lg:w-auto'>
            <Sidebar movie={item} cdnImage={cdnImage} peoples={peoples} topMovies={topMovies} />
          </div>
          <div className='w-full relative z-3'>
            <Hero movie={item} cdnImage={cdnImage} images={images} keywords={keywords} initialTap={initialTap} initialSv={initialSv} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailTemplatePage;
