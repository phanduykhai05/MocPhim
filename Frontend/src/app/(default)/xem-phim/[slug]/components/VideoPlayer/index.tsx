import Link from 'next/link';
import { ArrowLeft, Flag, Heart, ListVideo, Plus, Share2 } from 'lucide-react';

type VideoPlayerProps = {
  movieSlug: string;
  movieTitle: string;
  episode: number;
  server: number;
};

const VideoPlayer = ({ movieSlug, movieTitle, episode, server }: VideoPlayerProps) => {
  return (
    <section className="relative z-10 w-full">
      <div className="mb-4 flex items-center gap-2 lg:px-10">
        <Link
          href={`/phim/${movieSlug}`}
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/50 text-white/90 transition hover:bg-white/10"
          aria-label="Quay lại trang phim"
        >
          <ArrowLeft size={14} />
        </Link>
        <h2 className="text-xl font-semibold text-white lg:text-2xl">Xem phim {movieTitle}</h2>
      </div>

      <div className="relative rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-video overflow-hidden rounded-t-xl bg-[#08080a]">
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-black px-4 py-4">
            <div>
              <p className="text-base font-semibold text-white">{movieTitle}</p>
              <p className="text-sm font-semibold text-white/90">Phần 1 - Tập {episode}</p>
            </div>
            <button type="button" className="mt-1 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white">
              <ListVideo size={18} />
              <span>Danh sách tập</span>
            </button>
          </div>

          <iframe
            id="embed-player"
            title={`${movieTitle} - Tập ${episode}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            src="https://api.thiaphim.net/embed/470576"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <div className="flex h-16 w-full items-center gap-3 overflow-x-auto rounded-b-xl bg-[#08080a] px-5 text-xs text-white/90">
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <Heart size={14} />
            <span>Yêu thích</span>
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <Plus size={14} />
            <span>Thêm vào</span>
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <span>Chuyển tập</span>
            <span className="h-2 w-2 rounded-full bg-[#f1c84f]" />
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <span>Rạp phim</span>
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <Share2 size={14} />
            <span>Chia sẻ</span>
          </button>
          <div className="flex-grow" />
          <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
            <Flag size={14} />
            <span>Báo lỗi</span>
          </button>
          <span className="shrink-0 text-white/50">Server {server}</span>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
