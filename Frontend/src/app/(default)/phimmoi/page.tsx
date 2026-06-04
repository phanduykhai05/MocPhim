import Banner from "@/app/(default)/phimmoi/components/Banner";
import Topics from "@/app/(default)/phimmoi/components/Topics";
import BookmarkedMovies from "@/app/(home)/components/BookmarkedMovies";
import WatchedMovies from "@/app/(home)/components/WatchedMovies";
import { TopSeriesList } from "@/app/(default)/phimmoi/components/TopseriCard";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import { NewUpdateList } from "@/app/(default)/phimmoi/components/MovieUpdate";
import HappyMovie from "@/app/(default)/phimmoi/components/HappyMovie";
import { fetchHomeData, getThumbUrl, type ApiMovie } from "@/lib/api/home";
import { type MovieListItem, fetchCountryMovies, fetchYearMovies } from "@/lib/api/movie";
import CountryMovieSection, { type CountryMovie } from "@/app/(default)/phimmoi/components/CountryMovies";
import type { Movie } from "@/app/(default)/phimmoi/components/Banner/components/data/movie";
import type { MovieHorizontal } from "@/app/(default)/phimmoi/components/HappyMovie/components/types/movie";
import { File, Search, Settings } from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
type VietnamMarker = Marker & {
  overlay: {
    label: string;
    type?: "main" | "city" | "island";
  };
};

function toBannerMovies(items: ApiMovie[], cdn: string): Movie[] {
  return items.slice(0, 8).map((item) => {
    const images = item.image_url ?? item.image_urls;
    const desktopImage = images?.desktop || item.poster_url || item.thumb_url;
    const mobileImage = images?.mobile || item.thumb_url || item.poster_url;

    return {
      id: item._id,
      title: item.name,
      alias: item.origin_name,
      year: String(item.year),
      quality: item.quality,
      subtitle: item.lang,
      status: item.episode_current,
      genres: item.category.map((c) => c.name),
      description: "",
      poster: getThumbUrl(desktopImage, cdn),
      thumb: getThumbUrl(mobileImage, cdn),
      slug: item.slug,
      imdbScore: item.imdb?.vote_average || item.tmdb?.vote_average || undefined,
    };
  });
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

function toHappyMovies(items: MovieListItem[], cdn: string): MovieHorizontal[] {
  return items.slice(0, 8).map((item) => ({
    id: item._id,
    title: item.name,
    originalTitle: item.origin_name,
    slug: item.slug,
    posterUrl: getThumbUrl(item.poster_url || item.thumb_url, cdn),
    thumbUrl: getThumbUrl(item.thumb_url, cdn),
    tags: [String(item.year), item.quality],
    badgeStatus: item.episode_current,
  }));
}

function toCountryMovies(items: MovieListItem[], cdn: string): CountryMovie[] {
  return items.slice(0, 12).map((item) => {
    const epShort = parseEpisodeShort(item.episode_current);
    const lang = item.lang.toLowerCase();
    const badges: { type: "pd" | "lt" | "tm"; text: string }[] = [];
    if (lang.includes("vietsub")) badges.push({ type: "pd", text: epShort });
    if (lang.includes("thuyết minh")) badges.push({ type: "tm", text: epShort });
    if (lang.includes("lồng tiếng")) badges.push({ type: "lt", text: epShort });
    if (badges.length === 0) badges.push({ type: "pd", text: epShort });
    return {
      _id: item._id,
      name: item.name,
      origin_name: item.origin_name,
      slug: item.slug,
      thumb_url: getThumbUrl(item.thumb_url, cdn),
      quality: item.quality,
      lang: item.lang,
      year: item.year,
      episode_current: item.episode_current,
      badges,
    };
  });
}

export default async function PhimMoi() {
  const currentYear = new Date().getFullYear();
  const [homeData, latestYearData, vnData, krData, cnData] = await Promise.all([
    fetchHomeData(),
    fetchYearMovies(currentYear, { sort_field: 'year', sort_type: 'desc', size: 8 }),
    fetchCountryMovies('viet-nam', { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
    fetchCountryMovies('han-quoc',  { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
    fetchCountryMovies('trung-quoc', { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
  ]);
  const items = homeData?.items ?? [];
  const cdn = homeData?.cdnImage ?? process.env.NEXT_PUBLIC_CDN_IMAGE!;

  const bannerMovies = toBannerMovies(items, cdn);
  const updateMovies = toUpdateMovies(items, cdn);
  const topSeriesMovies = toTopSeriesMovies(items, cdn);
  const latestCdn = latestYearData?.cdnImage ?? cdn;
  const happyMovies = toHappyMovies(latestYearData?.items ?? [], latestCdn);
  const vnMovies  = toCountryMovies(vnData?.items  ?? [], vnData?.cdnImage  ?? cdn);
  const krMovies  = toCountryMovies(krData?.items  ?? [], krData?.cdnImage  ?? cdn);
  const cnMovies  = toCountryMovies(cnData?.items  ?? [], cnData?.cdnImage  ?? cdn);

  // SVG coordinate space: width=22, height=40
  //   region lng 101→110 (9°), lat 7.5→24 (16.5°)
  //   x = (lng - 101) / 9 * 22,  y = (24 - lat) / 16.5 * 40
  const markers: VietnamMarker[] = [
    // index 0 – Hà Nội          x≈11.8  y≈7.2
    { lat: 21.0278, lng: 105.8342, size: 0.5,  pulse: true,  overlay: { label: "Server Hà Nội",    type: "main" } },
    // index 1 – Hồ Chí Minh     x≈13.8  y≈31.9
    { lat: 10.8231, lng: 106.6297, size: 0.5,  pulse: true,  overlay: { label: "FPT Hồ Chí Minh", type: "main" } },
    // index 2-8 – thành phố nội địa
    { lat: 20.8449, lng: 106.6881, size: 0.32, pulse: false, overlay: { label: "Hải Phòng", type: "city" } },
    { lat: 18.6796, lng: 105.6813, size: 0.32, pulse: false, overlay: { label: "Vinh",      type: "city" } },
    { lat: 16.0544, lng: 108.2022, size: 0.32, pulse: false, overlay: { label: "Đà Nẵng",  type: "city" } },
    { lat: 13.7829, lng: 109.2196, size: 0.32, pulse: false, overlay: { label: "Quy Nhơn", type: "city" } },
    { lat: 12.2388, lng: 109.1967, size: 0.32, pulse: false, overlay: { label: "Nha Trang",type: "city" } },
    { lat: 11.9465, lng: 108.4419, size: 0.32, pulse: false, overlay: { label: "Đà Lạt",   type: "city" } },
    { lat: 10.0452, lng: 105.7469, size: 0.32, pulse: false, overlay: { label: "Cần Thơ",  type: "city" } },
    // index 9-10 – hải đảo (ngoài region mainland, hiển thị qua SVG clip)
    { lat: 16.5000, lng: 112.3400, size: 0.38, pulse: true,  overlay: { label: "Hoàng Sa",  type: "island" } },
    { lat: 10.0000, lng: 114.1700, size: 0.38, pulse: true,  overlay: { label: "Trường Sa", type: "island" } },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f0f3f8] dark:bg-[#191B24] font-sans text-gray-900 dark:text-white selection:bg-[#764ba2] selection:text-white transition-colors duration-300">
      <Banner movies={bannerMovies} />
      <Topics />
      <BookmarkedMovies />
      <WatchedMovies />
      <div className="rounded-2xl py-8 mx-4 md:mx-[50px] mb-10 3xl:mx-[80px] 4xl:mx-[120px]" style={{ background: 'linear-gradient(0deg, rgba(40, 43, 58, 0) 20%, rgb(40, 43, 58))' }}>
        <CountryMovieSection
        id="viet-nam"
        title="Phim Việt Nam Mới"
        viewAllLink="/quoc-gia/viet-nam"
        movies={vnMovies}
        gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(218, 37, 29) 130%)"
      />
      <CountryMovieSection
        id="han-quoc"
        title="Phim Hàn Quốc Mới"
        viewAllLink="/quoc-gia/han-quoc"
        movies={krMovies}
        gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(0, 100, 255) 130%)"
      />
      <CountryMovieSection
        id="trung-quoc"
        title="Phim Trung Quốc Mới"
        viewAllLink="/quoc-gia/trung-quoc"
        movies={cnMovies}
        gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(255, 180, 0) 130%)"
      />
      </div>
      
      <NewUpdateList movies={updateMovies} />
      <HappyMovie
        movies={happyMovies}
        title={`Phim Mới Nhất ${currentYear}`}
        viewAllHref={`/nam-phat-hanh/${currentYear}`}
      />
      <TopSeriesList movies={topSeriesMovies} />

      {/* Divider PTIT */}
      <div className="w-full max-w-[1900px] px-4 md:px-[50px] mx-auto my-6 3xl:max-w-[2400px] 4xl:max-w-[3200px]">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-white/10" />
          <p className="shrink-0 text-[11px] text-gray-400 dark:text-white/30 font-normal tracking-wide text-center whitespace-nowrap">
            Website Này Được 1 Nhóm Sinh Viên PTIT Tạo Ra Để Nộp Đồ Án&nbsp;&nbsp;|&nbsp;&nbsp;D23VHCN01-N&nbsp;&nbsp;|
          </p>
          <div className="flex-1 h-px bg-gray-300 dark:bg-white/10" />
        </div>
      </div>

      <div className="relative z-30 isolate w-full overflow-hidden h-[360px] md:h-[440px] flex">

        {/* ── Bên trái: Tech stack OrbitingCircles ── */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Center label */}
          <div className="absolute z-10 flex flex-col items-center gap-1 pointer-events-none select-none">
            <span className="text-xs font-semibold text-gray-500 dark:text-white/40 tracking-widest uppercase">Tech Stack</span>
          </div>

          {/* Outer orbit — 6 icons */}
          <OrbitingCircles iconSize={38} radius={155} speed={0.6}>
            <img src="https://thesvg.org/icons/nextdotjs/default.svg"   alt="Next.js"     className="w-8 h-8" title="Next.js" />
            <img src="https://thesvg.org/icons/react/default.svg"       alt="React"       className="w-8 h-8" title="React" />
            <img src="https://thesvg.org/icons/typescript/default.svg"  alt="TypeScript"  className="w-8 h-8" title="TypeScript" />
            <img src="https://thesvg.org/icons/spring-boot/default.svg" alt="Spring Boot" className="w-8 h-8" title="Spring Boot" />
            <img src="https://thesvg.org/icons/docker/default.svg"      alt="Docker"      className="w-8 h-8" title="Docker" />
            <img src="https://thesvg.org/icons/vercel/default.svg"      alt="Vercel"      className="w-8 h-8" title="Vercel" />
          </OrbitingCircles>

          {/* Inner orbit — 4 icons, reverse */}
          <OrbitingCircles iconSize={32} radius={88} reverse speed={0.9}>
            <img src="https://thesvg.org/icons/tailwind-css/default.svg" alt="Tailwind CSS"  className="w-10 h-10" title="Tailwind CSS" />
            <img src="https://thesvg.org/icons/java/default.svg"         alt="Java"          className="w-10 h-10" title="Java" />
            <img src="https://thesvg.org/icons/postgresql/default.svg"   alt="PostgreSQL"    className="w-10 h-10" title="PostgreSQL" />
            <img src="https://thesvg.org/icons/redis/default.svg"        alt="Redis"         className="w-10 h-10" title="Redis" />
          </OrbitingCircles>
        </div>

        {/* ── Bên phải: DottedMap ── */}
        <div className="relative flex-1">
          <DottedMap<VietnamMarker>
            className="absolute inset-0 z-10 h-full w-full text-[#5f6987]"
            markers={markers}
            markerColor="#22c55e"
            pulse
            width={22}
            height={40}
            mapSamples={1200}
            dotRadius={0.3}
            countries={["VNM"]}
            region={{ lat: { min: 7.5, max: 24 }, lng: { min: 101, max: 110 } }}
            connections={[
              // HN → HCM — trục chính xanh lá
              { from: 0, to: 1, color: '#22c55e', packetColor: '#86efac', dashArray: '0.7 0.45', duration: 2.2, delay: 0,   curve: 0.22 },
              // HCM → nội địa — xanh dương
              { from: 1, to: 2, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 0.3, curve: 0.18 },
              { from: 1, to: 3, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 0.6, curve: 0.18 },
              { from: 1, to: 4, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 0.9, curve: 0.18 },
              { from: 1, to: 5, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 1.2, curve: 0.18 },
              { from: 1, to: 6, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 1.5, curve: 0.18 },
              { from: 1, to: 7, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 1.8, curve: 0.18 },
              { from: 1, to: 8, color: '#60a5fa', packetColor: '#93c5fd', dashArray: '0.5 0.35', duration: 1.6, delay: 2.1, curve: 0.18 },
              // HCM → đảo chủ quyền (clip ngoài viewBox, vẫn render đường animate hướng ra biển)
              { from: 1, to: 9,  color: '#fbbf24', packetColor: '#fde68a', dashArray: '0.6 0.4', duration: 2.4, delay: 2.4, curve: 0.1 },
              { from: 1, to: 10, color: '#fbbf24', packetColor: '#fde68a', dashArray: '0.6 0.4', duration: 2.4, delay: 2.8, curve: 0.1 },
            ]}
            renderMarkerOverlay={({ marker, x, y }) => {
              const t = marker.overlay.type ?? "city"

              if (t === "main") {
                return (
                  <g transform={`translate(${x + 0.8} ${y - 1.2})`} pointerEvents="none">
                    <rect x="0" y="-0.85" width="2.2" height="1.6" rx="0.25" fill="#da251d" />
                    <text x="1.1" y="0.35" textAnchor="middle" fill="#ffde00" fontSize="0.85" fontWeight="700">★</text>
                    <text
                      x="2.8" y="0.6"
                      fill="#ffffff" fontSize="1.55" fontWeight="700" letterSpacing="0.18"
                      stroke="#0b0f18" strokeWidth="0.2" paintOrder="stroke"
                      style={{ fontFamily: "var(--font-sora), var(--font-roboto), sans-serif" }}
                    >{marker.overlay.label}</text>
                  </g>
                )
              }

              if (t === "island") {
                return (
                  <g transform={`translate(${x + 0.6} ${y - 0.9})`} pointerEvents="none">
                    <rect x="0" y="-0.7" width="1.7" height="1.2" rx="0.2" fill="#da251d" />
                    <text x="0.85" y="0.25" textAnchor="middle" fill="#ffde00" fontSize="0.7" fontWeight="700">★</text>
                    <text
                      x="2.2" y="0.45"
                      fill="#fde68a" fontSize="1.3" fontWeight="700" letterSpacing="0.1"
                      stroke="#0b0f18" strokeWidth="0.18" paintOrder="stroke"
                      style={{ fontFamily: "var(--font-sora), var(--font-roboto), sans-serif" }}
                    >{marker.overlay.label}</text>
                  </g>
                )
              }

              // city
              return (
                <g transform={`translate(${x + 0.5} ${y - 0.8})`} pointerEvents="none">
                  <text
                    x="0" y="0"
                    fill="#ffffff" fontSize="1.2" fontWeight="600" letterSpacing="0.08"
                    stroke="#0b0f18" strokeWidth="0.18" paintOrder="stroke"
                    style={{ fontFamily: "var(--font-sora), var(--font-roboto), sans-serif" }}
                  >{marker.overlay.label}</text>
                </g>
              )
            }}
          />
        </div>
      </div>
    </div>
    
  );
}

