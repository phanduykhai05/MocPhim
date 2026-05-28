import { notFound } from 'next/navigation';
import MovieDetailTemplate from './index';
import {
  fetchMovieDetail,
  fetchMoviePeoples,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieList,
} from '@/lib/api/movie';

export default async function MovieDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tap?: string; sv?: string }>;
}) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};

  const [movieData, peoplesData, imagesData, keywordsData, topMoviesData] = await Promise.all([
    fetchMovieDetail(slug),
    fetchMoviePeoples(slug),
    fetchMovieImages(slug),
    fetchMovieKeywords(slug),
    fetchMovieList({ list: 'phim-moi', sort_field: 'modified_time', sort_type: 'desc' }),
  ]);

  if (!movieData) notFound();

  return (
    <MovieDetailTemplate
      movieData={movieData}
      peoples={peoplesData}
      images={imagesData}
      keywords={keywordsData}
      topMovies={topMoviesData}
      initialTap={Number(query?.tap ?? 1)}
      initialSv={Number(query?.sv ?? 0)}
    />
  );
}
