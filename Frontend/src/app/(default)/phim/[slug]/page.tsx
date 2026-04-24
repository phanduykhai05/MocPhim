import { notFound } from 'next/navigation';
import MovieDetailTemplate from './index';
import {
  fetchMovieDetail,
  fetchMoviePeoples,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieList,
} from '@/lib/api/movie';

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [movieData, peoplesData, imagesData, keywordsData, topMoviesData] = await Promise.all([
    fetchMovieDetail(slug),
    fetchMoviePeoples(slug),
    fetchMovieImages(slug),
    fetchMovieKeywords(slug),
    fetchMovieList({ slug: 'phim-moi', sort_field: 'modified_time', sort_type: 'desc' }),
  ]);

  if (!movieData) notFound();

  return (
    <MovieDetailTemplate
      movieData={movieData}
      peoples={peoplesData}
      images={imagesData}
      keywords={keywordsData}
      topMovies={topMoviesData}
    />
  );
}
