import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';

type MovieMetaPanelProps = {
  movie: WatchMovie;
};

const MovieMetaPanel = ({ movie }: MovieMetaPanelProps) => {
  return (
    <section className="rounded-2xl border border-white/5 bg-[#191b24]/60 p-4 lg:p-5">
      <div className="grid gap-4 lg:grid-cols-[96px_minmax(0,1fr)_240px] lg:items-start">
        <div className="relative h-[138px] w-[96px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#121521]">
          <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-white">{movie.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-[#f1c84f] px-2 py-1 font-semibold text-black">IMDb {movie.imdbScore}</span>
            <span className="rounded bg-white/10 px-2 py-1 text-white/85">{movie.ageRating}</span>
            <span className="rounded bg-white/10 px-2 py-1 text-white/85">{movie.quality}</span>
            <span className="rounded bg-white/10 px-2 py-1 text-white/85">{movie.duration}</span>
          </div>

          <div className="mt-3 space-y-1 text-xs text-white/70">
            <p>
              <span className="text-white/50">Thể loại:</span> {movie.genres.join(', ')}
            </p>
            <p>
              <span className="text-white/50">Quốc gia:</span> {movie.country}
            </p>
            <p>
              <span className="text-white/50">Trạng thái:</span> {movie.status}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <h3 className="text-sm font-semibold text-white">Diễn viên</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {movie.casts.slice(0, 6).map((cast) => (
              <div key={cast} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-white/10" />
                <p className="mt-1 truncate text-[10px] text-white/65">{cast}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/70">{movie.description}</p>
    </section>
  );
};

export default MovieMetaPanel;
