import Link from 'next/link';
import type { WatchEpisode } from '@/app/(default)/xem-phim/[slug]/types';
import { Play } from 'lucide-react';
type EpisodeSelectorProps = {
  slug: string;
  currentEpisode: number;
  server: number;
  episodes: WatchEpisode[];
  sectionLabel: string;
};

const EpisodeSelector = ({ slug, currentEpisode, server, episodes, sectionLabel }: EpisodeSelectorProps) => {
  return (
    <section className="rounded-2xl border border-gray-300 dark:border-white/5 bg-gray-100 dark:bg-[#191b24]/60 p-4 lg:p-5 transition-colors duration-300">
      <div className="mb-3 flex items-center gap-3 border-b border-gray-300 dark:border-white/5 pb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{sectionLabel}</h2>
        <span className="text-xs text-gray-500 dark:text-white/45">Danh sách tập</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {episodes.map((episode) => {
          const isActive = episode.number === currentEpisode;

          return (
            <Link
              key={episode.number}
              href={`/xem-phim/${slug}?tap=${episode.number}&sv=${server}`}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-tr from-[#fecf59] to-[#fff1cc] shadow-[0_5px_10px_5px_rgba(255,218,125,0.1)] text-black ring-1 ring-[#f1c84f]/55'
                  : 'bg-gray-200 dark:bg-white/5 text-gray-800 dark:text-white/90 hover:bg-gray-300 dark:hover:bg-[#303851]'
              }`}
            >
              <Play className="h-4 w-4" /><span>Tập {episode.number}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default EpisodeSelector;
