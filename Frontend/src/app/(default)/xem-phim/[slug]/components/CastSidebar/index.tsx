import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';

type CastSidebarProps = {
  movie: WatchMovie;
};

type SuggestionItem = {
  title: string;
  alias: string;
  quality: string;
  progress: string;
  thumbnail: string;
  href: string;
};

const suggestions: SuggestionItem[] = [
  {
    title: 'Hoa Hướng Dương',
    alias: 'We Girls',
    quality: 'HD Vietsub',
    progress: 'Hoàn Tất (Full/1)',
    thumbnail: 'https://rophims.vip/wp-content/uploads/2026/03/phuong-hoa-ly-35575-thumb-2.jpg',
    href: '/phim/phuong-hoa-ly',
  },
  {
    title: 'Sinh Vật Gyeongseong (Phần 2)',
    alias: 'Gyeongseong Creature (Season 2)',
    quality: 'HD Vietsub',
    progress: 'Hoàn tất (7/7)',
    thumbnail: 'https://rophims.vip/wp-content/uploads/2026/03/khong-the-dung-yeu-19048-thumb.jpg',
    href: '/phim/khong-the-dung-yeu',
  },
  {
    title: 'Lần này tôi sẽ quay lại',
    alias: "I'll Turn Back This Time",
    quality: 'HD Vietsub',
    progress: 'Tập 1/6 Tập',
    thumbnail: 'https://rophims.vip/wp-content/uploads/2026/03/senpai-vung-ve-cua-toi-34283-thumb.jpg',
    href: '/phim/senpai-vung-ve-cua-toi',
  },
  {
    title: 'Cám Dỗ Chết Chóc (Phần 2)',
    alias: 'Fatal Seduction (Season 2)',
    quality: 'HD Vietsub',
    progress: 'Hoàn tất (10/10)',
    thumbnail: 'https://rophims.vip/wp-content/uploads/2026/03/thuc-cam-nhan-gia-21274-thumb.jpg',
    href: '/phim/thuc-cam-nhan-gia',
  },
  {
    title: 'Cuộc Sống Nông Dân Ở Thế Giới Khác (Phần 2)',
    alias: 'Farming Life In Another World (Season 2)',
    quality: 'FHD Vietsub',
    progress: 'Full/12',
    thumbnail: 'https://rophims.vip/wp-content/uploads/2026/03/ban-tinh-phu-sinh-29410-thumb.jpg',
    href: '/phim/ban-tinh-phu-sinh',
  },
];

const CastSidebar = ({ movie }: CastSidebarProps) => {
  return (
    <aside className="rounded-2xl bg-[#191b24]/60 p-4 lg:p-0">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="text-sm text-white/80">Đánh giá</div>
        <button
          type="button"
          className="rounded-full bg-[linear-gradient(39deg,rgba(254,207,89,1)_0%,rgba(255,241,204,1)_100%)] px-4 py-1.5 text-xs font-semibold text-black"
        >
          {movie.imdbScore} điểm
        </button>
      </div>

      <div className="mt-8 border-t border-white/5 pt-4">
        <h4 className="text-lg font-semibold text-white">Đề xuất cho bạn</h4>
        <div className="mt-2 flex flex-col gap-1">
          {suggestions.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex gap-4 rounded-xl border border-white/5 bg-white/5 p-2 transition hover:bg-white/15"
            >
              <div className="h-[94px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-[#111523]">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h5 className="line-clamp-2 text-base font-semibold leading-snug text-white">{item.title}</h5>
                <p className="mt-1 line-clamp-1 text-sm text-white/45">{item.alias}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-white/55">
                  <span className="font-bold text-white/85">{item.quality}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{item.progress}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CastSidebar;
