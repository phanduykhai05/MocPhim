import Link from 'next/link';
import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';
import { getMovieThumb, MovieListItem } from '@/lib/api/movie';

type CastSidebarProps = {
  movie: WatchMovie;
  suggestions: MovieListItem[];
  cdnImage: string;
};

const CastSidebar = ({ movie, suggestions, cdnImage }: CastSidebarProps) => {
  return (
    <aside className="rounded-2xl bg-gray-100 dark:bg-[#191b24]/60 p-4 lg:p-0 transition-colors duration-300">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-300 dark:border-white/5 pb-4">
        <div className="text-sm text-gray-700 dark:text-white/80">Đánh giá</div>
        <button
          type="button"
          className="rounded-full bg-[linear-gradient(39deg,rgba(254,207,89,1)_0%,rgba(255,241,204,1)_100%)] px-4 py-1.5 text-xs font-semibold text-black"
        >
          {movie.imdbScore} điểm
        </button>
      </div>

      <div className="mt-8 border-t border-gray-300 dark:border-white/5 pt-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Đề xuất cho bạn</h4>
        <div className="mt-2 flex flex-col gap-1">
          {suggestions.slice(0, 8).map((item) => (
            <Link
              key={item._id}
              href={`/phim/${item.slug}`}
              className="flex gap-4 rounded-xl border border-gray-300 dark:border-white/5 bg-white/70 dark:bg-white/5 p-2 transition hover:bg-gray-200 dark:hover:bg-white/15"
            >
              <div className="h-[94px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-[#111523]">
                <img
                  src={getMovieThumb(item.thumb_url, cdnImage)}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h5 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 dark:text-white">{item.name}</h5>
                <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-white/45">{item.origin_name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-600 dark:text-white/55">
                  <span className="font-bold text-gray-800 dark:text-white/85">{item.quality}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400 dark:bg-white/20" />
                  <span>{item.episode_current}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CastSidebar;
