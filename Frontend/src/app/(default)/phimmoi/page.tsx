import Banner from "@/app/(default)/phimmoi/components/Banner";
import Topics from "@/app/(default)/phimmoi/components/Topics";
import BookmarkedMovies from "@/app/(home)/components/BookmarkedMovies";
import { TopSeriesList } from "@/app/(default)/phimmoi/components/TopseriCard";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import { NewUpdateList } from "@/app/(default)/phimmoi/components/MovieUpdate";
import HappyMovie from "@/app/(default)/phimmoi/components/HappyMovie";
import { fetchHomeData, getThumbUrl, type ApiMovie } from "@/lib/api/home";
import type { Movie } from "@/app/(default)/phimmoi/components/Banner/components/data/movie";
import type { MovieHorizontal } from "@/app/(default)/phimmoi/components/HappyMovie/components/types/movie";

type VietnamMarker = Marker & {
  overlay: {
    label: string;
  };
};

function toBannerMovies(items: ApiMovie[], cdn: string): Movie[] {
  return items.slice(0, 8).map((item, i) => ({
    id: item._id,
    title: item.name,
    alias: item.origin_name,
    year: String(item.year),
    quality: item.quality,
    subtitle: item.lang,
    status: item.episode_current,
    genres: item.category.map((c) => c.name),
    description: "",
    poster: getThumbUrl(item.thumb_url, cdn),
    slug: item.slug,
  }));
}

function toUpdateMovies(items: ApiMovie[], cdn: string) {
  return items.map((item) => {
    const epShort = parseEpisodeShort(item.episode_current);
    const lang = item.lang.toLowerCase();
    const badges: { type: "pd" | "lt" | "tm"; text: string }[] = [];
    if (lang.includes("vietsub")) badges.push({ type: "pd", text: epShort });
    if (lang.includes("thuyết minh")) badges.push({ type: "tm", text: epShort });
    if (lang.includes("lồng tiếng")) badges.push({ type: "lt", text: epShort });
    if (badges.length === 0) badges.push({ type: "pd", text: epShort });
    return {
      title: item.name,
      originName: item.origin_name,
      slug: item.slug,
      thumb: getThumbUrl(item.thumb_url, cdn),
      badges,
    };
  });
}

function parseEpisodeShort(ep: string): string {
  if (/hoàn tất/i.test(ep)) return "HT";
  if (/^full$/i.test(ep.trim())) return "Full";
  const m = ep.match(/tập\s*(\d+)/i);
  if (m) return m[1];
  if (/trailer/i.test(ep)) return "TR";
  return ep.slice(0, 4);
}

function toTopSeriesMovies(items: ApiMovie[], cdn: string) {
  return items
    .filter((item) => item.type === "series" || item.type === "tvshows")
    .slice(0, 10)
    .map((item) => {
      const epShort = parseEpisodeShort(item.episode_current);
      const lang = item.lang.toLowerCase();
      const badges: { type: "pd" | "lt" | "tm"; text: string }[] = [];
      if (lang.includes("vietsub")) badges.push({ type: "pd", text: epShort });
      if (lang.includes("thuyết minh")) badges.push({ type: "tm", text: epShort });
      if (lang.includes("lồng tiếng")) badges.push({ type: "lt", text: epShort });
      if (badges.length === 0) badges.push({ type: "pd", text: epShort });
      return {
        title: item.name,
        alias: item.origin_name,
        slug: item.slug,
        thumb: getThumbUrl(item.thumb_url, cdn),
        episodeText: item.episode_current,
        badges,
      };
    });
}

function toHappyMovies(items: ApiMovie[], cdn: string): MovieHorizontal[] {
  return items
    .filter((item) => item.type === "single")
    .slice(0, 8)
    .map((item) => ({
      id: item._id,
      title: item.name,
      originalTitle: item.origin_name,
      slug: item.slug,
      posterUrl: getThumbUrl(item.thumb_url, cdn),
      thumbUrl: getThumbUrl(item.thumb_url, cdn),
      tags: [String(item.year), item.quality],
      badgeStatus: item.episode_current,
    }));
}

export default async function PhimMoi() {
  const homeData = await fetchHomeData();
  const items = homeData?.items ?? [];
  const cdn = homeData?.cdnImage ?? process.env.NEXT_PUBLIC_CDN_IMAGE!;

  const bannerMovies = toBannerMovies(items, cdn);
  const updateMovies = toUpdateMovies(items, cdn);
  const topSeriesMovies = toTopSeriesMovies(items, cdn);
  const happyMovies = toHappyMovies(items, cdn);

  const markers: VietnamMarker[] = [
    {
      lat: 16.047079,
      lng: 108.20623,
      size: 0.8,
      pulse: true,
      overlay: { label: "FPT Hồ Chí Minh" },
    },
    {
      lat: 41.0278,
      lng: 105.8342,
      size: 0.8,
      pulse: true,
      overlay: { label: "Server Hà Nội" },
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#191B24] font-sans text-white selection:bg-[#764ba2] selection:text-white">
      <Banner movies={bannerMovies} />
      <Topics />
      <BookmarkedMovies />
      <NewUpdateList movies={updateMovies} />
      <HappyMovie movies={happyMovies} />
      <TopSeriesList movies={topSeriesMovies} />
      <div className="relative z-30 isolate -mt-6 h-[220px] w-full overflow-hidden sm:h-[280px] md:mt-0 md:h-[400px]">
        <DottedMap<VietnamMarker>
          className="relative z-10 h-full w-full text-[#5f6987]"
          markers={markers}
          markerColor="#22c55e"
          pulse
          renderMarkerOverlay={({ marker, x, y }) => (
            <g transform={`translate(${x + 1.4} ${y - 1.8})`} pointerEvents="none">
              <rect x="1.1" y="-1.15" width="3.2" height="2.2" rx="0.35" fill="#da251d" />
              <text x="2.7" y="0.45" textAnchor="middle" fill="#ffde00" fontSize="1.1" fontWeight="700">★</text>
              <text
                x="5.9"
                y="0.85"
                fill="#ffffff"
                fontSize="2.15"
                fontWeight="700"
                letterSpacing="0.28"
                stroke="#0b0f18"
                strokeWidth="0.22"
                paintOrder="stroke"
                style={{ fontFamily: "var(--font-sora), var(--font-roboto), sans-serif" }}
              >
                {marker.overlay.label}
              </text>
            </g>
          )}
        />
      </div>
    </div>
    
  );
}