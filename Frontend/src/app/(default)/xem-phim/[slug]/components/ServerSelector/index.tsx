import Link from 'next/link';
import type { WatchServer } from '@/app/(default)/xem-phim/[slug]/types';

type ServerSelectorProps = {
  slug: string;
  episode: number;
  currentServer: number;
  servers: WatchServer[];
};

const ServerSelector = ({ slug, episode, currentServer, servers }: ServerSelectorProps) => {
  return (
    <section className="bg-gray-100 dark:bg-[#191b24]/60 p-4 lg:p-5 rounded-2xl">
      <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80">Nguồn phát</h2>
      <div className="flex flex-wrap gap-2">
        {servers.map((server) => {
          const isActive = server.id === currentServer;

          return (
            <Link
              key={server.id}
              href={`/xem-phim/${slug}?tap=${episode}&sv=${server.id}`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-[#f1c84f] text-black'
                  : 'bg-gray-200 dark:bg-white/[0.06] text-gray-700 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-white/15'
              }`}
            >
              {server.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ServerSelector;
