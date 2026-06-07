import type { Metadata } from 'next';
import WatchMovieTemplate from '@/app/(default)/xem-phim/[slug]/index';
import { fetchMovieDetail, fetchMovieList, fetchMoviePeoples, type PeoplesData } from '@/lib/api/movie';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchMovieDetail(slug);
  if (!data) return {};
  const { item, cdnImage } = data;
  const title = `Phim ${item.name} (${item.origin_name}) - MocPhim`;
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

  const [movieData, topMoviesData, peoplesData] = await Promise.all([
    fetchMovieDetail(slug),
    fetchMovieList({ list: 'phim-moi', sort_field: 'modified_time', sort_type: 'desc' }),
    fetchMoviePeoples(slug),
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
      peoplesData={peoplesData}
      tap={query?.tap}
      sv={query?.sv}
    />
  );
}
