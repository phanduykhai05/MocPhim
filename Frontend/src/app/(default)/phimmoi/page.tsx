import Banner from "@/app/(default)/phimmoi/components/Banner";
import Topics from "@/app/(default)/phimmoi/components/Topics";
import BookmarkedMovies from "@/app/(home)/components/BookmarkedMovies";
import WatchedMovies from "@/app/(home)/components/WatchedMovies";
import { TopSeriesList } from "@/app/(default)/phimmoi/components/TopseriCard";
import { NewUpdateList } from "@/app/(default)/phimmoi/components/MovieUpdate";
import HappyMovie from "@/app/(default)/phimmoi/components/HappyMovie";
import TechStackSectionLazy from "@/app/(default)/phimmoi/components/TechStackSectionLazy";
import { fetchHomeData, getThumbUrl, type ApiMovie } from "@/lib/api/home";
import { type MovieListItem, fetchCountryMovies, fetchYearMovies, fetchMovieList } from "@/lib/api/movie";
import CountryMovieSection, { type CountryMovie } from "@/app/(default)/phimmoi/components/CountryMovies";
import type { Movie } from "@/app/(default)/phimmoi/components/Banner/components/data/movie";
import type { MovieHorizontal } from "@/app/(default)/phimmoi/components/HappyMovie/components/types/movie";

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

function toBannerMoviesFromList(items: MovieListItem[], cdn: string): Movie[] {
  return items.slice(0, 8).map((item) => ({
    id: item._id,
    title: item.name,
    alias: item.origin_name,
    year: String(item.year),
    quality: item.quality,
    subtitle: item.lang,
    status: item.episode_current,
    genres: item.category?.map((c) => c.name) ?? [],
    description: item.content ?? "",
    poster: getThumbUrl(item.poster_url || item.thumb_url, cdn),
    thumb: getThumbUrl(item.thumb_url, cdn),
    slug: item.slug,
    imdbScore: item.imdb?.vote_average || item.tmdb?.vote_average || undefined,
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

function toUpdateMoviesFromList(items: MovieListItem[], cdn: string) {
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
      thumb: getThumbUrl(item.thumb_url || item.poster_url || "", cdn),
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

function toTopSeriesFromList(items: MovieListItem[], cdn: string) {
  // Deduplicate by slug
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.slug)) return false;
    seen.add(i.slug);
    return true;
  });

  return unique
    .filter((i) => i.type === "series" || i.type === "tvshows")
    .sort((a, b) => {
      const rA = a.tmdb?.vote_average ?? a.imdb?.vote_average ?? -1;
      const rB = b.tmdb?.vote_average ?? b.imdb?.vote_average ?? -1;
      if (rB !== rA) return rB - rA;
      return (b.year ?? 0) - (a.year ?? 0);
    })
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
  const [homeData, latestYearData, vnData, krData, cnData, seriesY1Data, seriesY2Data, latestAllData] = await Promise.all([
    fetchHomeData(),
    fetchYearMovies(currentYear, { sort_field: 'year', sort_type: 'desc', size: 16 }),
    fetchCountryMovies('viet-nam', { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
    fetchCountryMovies('han-quoc',  { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
    fetchCountryMovies('trung-quoc', { sort_field: 'year', sort_type: 'desc', size: 12, year: currentYear }),
    fetchMovieList({ list: 'phim-bo', year: currentYear - 1, sort_field: 'year', sort_type: 'desc', size: 24 }),
    fetchMovieList({ list: 'phim-bo', year: currentYear - 2, sort_field: 'year', sort_type: 'desc', size: 24 }),
    fetchMovieList({ sort_field: 'year', sort_type: 'desc', size: 24 }),
  ]);
  const items = homeData?.items ?? [];
  const cdn = homeData?.cdnImage ?? process.env.NEXT_PUBLIC_CDN_IMAGE!;

  const latestAllItems = latestAllData?.items ?? [];
  const latestAllCdn = latestAllData?.cdnImage ?? cdn;
  const updateMovies = latestAllItems.length > 0
    ? toUpdateMoviesFromList(latestAllItems, latestAllCdn)
    : toUpdateMovies(items, cdn);
  const allSeriesItems = [
    ...(seriesY1Data?.items ?? []),
    ...(seriesY2Data?.items ?? []),
  ];
  const topSeriesCdn = seriesY1Data?.cdnImage ?? seriesY2Data?.cdnImage ?? cdn;
  const topSeriesMovies = allSeriesItems.length > 0
    ? toTopSeriesFromList(allSeriesItems, topSeriesCdn)
    : toTopSeriesMovies(items, cdn);
  const latestCdn = latestYearData?.cdnImage ?? cdn;
  const latestItems = latestYearData?.items ?? [];
  const bannerMovies = latestItems.length > 0
    ? toBannerMoviesFromList(latestItems.slice(0, 8), latestCdn)
    : toBannerMovies(items, cdn);
  const happyMovies = latestItems.length > 8
    ? toHappyMovies(latestItems.slice(8), latestCdn)
    : toHappyMovies(latestAllItems.slice(0, 8), latestAllCdn);
  const vnMovies  = toCountryMovies(vnData?.items  ?? [], vnData?.cdnImage  ?? cdn);
  const krMovies  = toCountryMovies(krData?.items  ?? [], krData?.cdnImage  ?? cdn);
  const cnMovies  = toCountryMovies(cnData?.items  ?? [], cnData?.cdnImage  ?? cdn);


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

      <TechStackSectionLazy />
    </div>
    
  );
}

