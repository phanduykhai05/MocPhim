import CastSidebar from '@/app/(default)/xem-phim/[slug]/components/CastSidebar';
import CommentSection from '@/app/(default)/xem-phim/[slug]/components/CommentSection';
import EpisodeSelector from '@/app/(default)/xem-phim/[slug]/components/EpisodeSelector';
import MovieMetaPanel from '@/app/(default)/xem-phim/[slug]/components/MovieMetaPanel';
import ServerSelector from '@/app/(default)/xem-phim/[slug]/components/ServerSelector';
import VideoPlayer from '@/app/(default)/xem-phim/[slug]/components/VideoPlayer';
import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';
import { MovieDetailResult, MovieListItem, getMovieThumb } from '@/lib/api/movie';

type WatchMovieTemplateProps = {
  slug: string;
  movieData: MovieDetailResult;
  topMovies: MovieListItem[];
  topMoviesCdnImage: string;
  tap?: string;
  sv?: string;
};

const normalizePositiveNumber = (value: string | undefined, fallback: number) => {
  const parsedValue = Number.parseInt(value ?? '', 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const WatchMovieTemplate = ({
  slug,
  movieData,
  topMovies,
  topMoviesCdnImage,
  tap,
  sv,
}: WatchMovieTemplateProps) => {
  const { item, cdnImage } = movieData;
  const servers = item.episodes.map((server, serverIdx) => ({
    id: serverIdx,
    name: server.server_name,
    episodes: server.server_data.map((episode, episodeIdx) => ({
      number: episodeIdx + 1,
      name: episode.name,
      slug: episode.slug,
      linkEmbed: episode.link_embed,
    })),
  }));

  const movie: WatchMovie = {
    movieId: item._id,
    slug: item.slug,
    title: item.name,
    altTitle: item.origin_name,
    year: item.year,
    quality: item.quality,
    duration: item.time,
    description: item.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    poster: getMovieThumb(item.poster_url || item.thumb_url, cdnImage),
    imdbScore: item.imdb?.vote_average || item.tmdb?.vote_average || 0,
    genres: item.category.map((c) => c.name),
    country: item.country.map((c) => c.name).join(', ') || 'Đang cập nhật',
    status: item.episode_current || item.status,
    casts: item.actor || [],
    servers,
  };

  const serverFromQuery = normalizePositiveNumber(sv, 0);
  const hasServer = movie.servers.some((server) => server.id === serverFromQuery);
  const currentServer = hasServer ? serverFromQuery : movie.servers[0]?.id ?? 0;
  const activeServer = movie.servers.find((server) => server.id === currentServer);

  const episodeFromQuery = normalizePositiveNumber(tap, 1);
  const maxEpisode = activeServer?.episodes[activeServer.episodes.length - 1]?.number ?? 1;
  const currentEpisode = Math.min(episodeFromQuery, maxEpisode);
  const currentEpisodeData = activeServer?.episodes.find((ep) => ep.number === currentEpisode);

  return (
    <div className="min-h-screen bg-[#f0f3f8] dark:bg-[#191b24] pb-12 pt-5 lg:pt-30 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1640px] px-5 3xl:max-w-[2200px] 4xl:max-w-[2800px]">
        <div className="grid gap-3 lg:gap-4">
          <VideoPlayer
            movieSlug={slug}
            movieId={movie.movieId}
            movieTitle={movie.title}
            episode={currentEpisode}
            server={currentServer}
            embedUrl={currentEpisodeData?.linkEmbed || ''}
            hasTapParam={tap !== undefined}
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_450px] lg:gap-6">
            <div className="grid gap-4">
              <MovieMetaPanel movie={movie} />
              <ServerSelector
                slug={slug}
                episode={currentEpisode}
                currentServer={currentServer}
                servers={movie.servers}
              />
              <EpisodeSelector
                slug={slug}
                movieId={movie.movieId}
                currentEpisode={currentEpisode}
                server={currentServer}
                episodes={activeServer?.episodes ?? []}
                sectionLabel={activeServer?.name || 'Danh sách tập'}
              />
              <CommentSection />
            </div>

            <div className="lg:border-l lg:border-gray-300 dark:lg:border-white/5 lg:pl-6">
              <CastSidebar
                movie={movie}
                suggestions={topMovies}
                cdnImage={topMoviesCdnImage || cdnImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovieTemplate;
