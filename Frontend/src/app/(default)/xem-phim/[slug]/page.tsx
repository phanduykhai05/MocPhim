import WatchMovieTemplate from '@/app/(default)/xem-phim/[slug]/index';
import { fetchMovieDetail, fetchMovieList } from '@/lib/api/movie';
import { notFound } from 'next/navigation';

type WatchMoviePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tap?: string; sv?: string }>;
};

export default async function WatchMoviePage({
  params,
  searchParams,
}: WatchMoviePageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : undefined;

  const [movieData, topMoviesData] = await Promise.all([
    fetchMovieDetail(slug),
    fetchMovieList({ list: 'phim-moi', sort_field: 'modified_time', sort_type: 'desc' }),
  ]);

  if (!movieData) {
    notFound();
  }

  return (
    <WatchMovieTemplate
      slug={slug}
      movieData={movieData}
      topMovies={topMoviesData?.items ?? []}
      topMoviesCdnImage={topMoviesData?.cdnImage || movieData.cdnImage}
      tap={query?.tap}
      sv={query?.sv}
    />
  );
}
