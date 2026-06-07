import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';

type WatchHeaderProps = {
  movie: WatchMovie;
  episode: number;
};

const WatchHeader = ({ movie, episode }: WatchHeaderProps) => {
  return (
    <section className="border-b border-white/5 pb-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
        <span className="text-white/40">Xem phim</span>
        <span className="text-white/30">/</span>
        <h1 className="max-w-full truncate font-semibold text-white">
          {movie.title} - Tập {episode}
        </h1>
      </div>
    </section>
  );
};

export default WatchHeader;
