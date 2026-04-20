import CastSidebar from '@/app/(default)/xem-phim/[slug]/components/CastSidebar';
import CommentSection from '@/app/(default)/xem-phim/[slug]/components/CommentSection';
import EpisodeSelector from '@/app/(default)/xem-phim/[slug]/components/EpisodeSelector';
import MovieMetaPanel from '@/app/(default)/xem-phim/[slug]/components/MovieMetaPanel';
import ServerSelector from '@/app/(default)/xem-phim/[slug]/components/ServerSelector';
import VideoPlayer from '@/app/(default)/xem-phim/[slug]/components/VideoPlayer';
import { getWatchMovieBySlug } from '@/app/(default)/xem-phim/[slug]/data/mockData';

type WatchMovieTemplateProps = {
  slug: string;
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

const WatchMovieTemplate = ({ slug, tap, sv }: WatchMovieTemplateProps) => {
  const movie = getWatchMovieBySlug(slug);

  const episodeFromQuery = normalizePositiveNumber(tap, 1);
  const maxEpisode = movie.episodes[movie.episodes.length - 1]?.number ?? 1;
  const currentEpisode = Math.min(episodeFromQuery, maxEpisode);

  const serverFromQuery = normalizePositiveNumber(sv, 0);
  const hasServer = movie.servers.some((server) => server.id === serverFromQuery);
  const currentServer = hasServer ? serverFromQuery : movie.servers[0]?.id ?? 0;

  return (
    <div className="min-h-screen bg-[#191b24] pb-12 pt-5 lg:pt-30">
      <div className="mx-auto w-full max-w-[1640px] px-5">
        <div className="grid gap-3 lg:gap-4">
          <VideoPlayer
            movieSlug={slug}
            movieTitle={movie.title}
            episode={currentEpisode}
            server={currentServer}
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
                currentEpisode={currentEpisode}
                server={currentServer}
                episodes={movie.episodes}
                sectionLabel={movie.sectionLabel}
              />
              <CommentSection />
            </div>

            <div className="lg:border-l lg:border-white/5 lg:pl-6">
              <CastSidebar movie={movie} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovieTemplate;
