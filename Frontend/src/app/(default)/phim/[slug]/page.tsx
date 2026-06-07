import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MovieDetailTemplate from './index';
import {
  fetchMovieDetail,
  fetchMoviePeoples,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieList,
} from '@/lib/api/movie';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchMovieDetail(slug);
  if (!data) return {};
  const { item, cdnImage } = data;
  const title = `${item.name} (${item.origin_name}) - MocPhim`;
  const description = item.content?.replace(/<[^>]*>/g, '').slice(0, 160) ?? `Xem phim ${item.name} vietsub HD miễn phí tại MocPhim.`;
  const image = item.thumb_url?.startsWith('http')
    ? item.thumb_url
    : `${cdnImage}/uploads/movies/${item.thumb_url}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

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
