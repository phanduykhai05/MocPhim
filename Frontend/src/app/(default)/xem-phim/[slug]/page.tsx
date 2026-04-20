import WatchMovieTemplate from '@/app/(default)/xem-phim/[slug]/index';

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

  return <WatchMovieTemplate slug={slug} tap={query?.tap} sv={query?.sv} />;
}
