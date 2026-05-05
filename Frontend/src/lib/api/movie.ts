const API = process.env.NEXT_PUBLIC_API_URL!;
const CDN = process.env.NEXT_PUBLIC_CDN_IMAGE!;

export function getMovieThumb(thumb_url: string, cdn = CDN): string {
  if (!thumb_url) return '';
  if (thumb_url.startsWith('http')) return thumb_url;
  return `${cdn}/uploads/movies/${thumb_url}`;
}

// ─── Movie Detail Types ────────────────────────────────────────────────────────

export interface MovieEpisode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface MovieServer {
  server_name: string;
  is_ai: boolean;
  server_data: MovieEpisode[];
}

export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  alternative_names: string[];
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
  episodes: MovieServer[];
  tmdb: { type: string; id: string; season: number; vote_average: number; vote_count: number };
  imdb: { id: string; vote_average: number; vote_count: number };
  chieurap: boolean;
  sub_docquyen: boolean;
}

export interface MovieDetailResult {
  item: MovieItem;
  cdnImage: string;
}

// ─── Peoples Types ─────────────────────────────────────────────────────────────

export interface PersonData {
  tmdb_people_id: number;
  name: string;
  original_name: string;
  character: string;
  known_for_department: string;
  profile_path: string;
  gender_name: string;
}

export interface PeoplesData {
  peoples: PersonData[];
  profile_sizes: { w185: string; original: string; w45: string; h632: string };
  slug: string;
}

// ─── Keywords Types ────────────────────────────────────────────────────────────

export interface KeywordItem {
  tmdb_keyword_id: number;
  name: string;
  name_vn: string;
}

export interface KeywordsData {
  keywords: KeywordItem[];
  slug: string;
}

// ─── Images Types ──────────────────────────────────────────────────────────────

export interface MovieImageItem {
  file_path: string;
  width: number;
  height: number;
}

export interface MoviesImagesData {
  image_sizes: {
    backdrop: { original: string; w1280: string; w300: string; w780: string };
    poster: { original: string; w500: string; w342: string; w185: string; w154: string; w780: string };
  };
  backdrops?: MovieImageItem[];
  posters?: MovieImageItem[];
  slug: string;
}

// ─── Movie List Types ──────────────────────────────────────────────────────────

export interface MovieListItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function fetchMovieDetail(slug: string): Promise<MovieDetailResult | null> {
  try {
    const res = await fetch(`${API}/movies/${slug}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const inner = json?.data?.data;
    if (!inner?.item) return null;
    return {
      item: inner.item,
      cdnImage: inner.APP_DOMAIN_CDN_IMAGE || CDN,
    };
  } catch {
    return null;
  }
}

export async function fetchMoviePeoples(slug: string): Promise<PeoplesData | null> {
  try {
    const res = await fetch(`${API}/movies/${slug}/peoples`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchMovieImages(slug: string): Promise<MoviesImagesData | null> {
  try {
    const res = await fetch(`${API}/movies/${slug}/images`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchMovieKeywords(slug: string): Promise<KeywordsData | null> {
  try {
    const res = await fetch(`${API}/movies/${slug}/keywords`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchMovieList(params: {
  slug?: string;
  page?: number;
  sort_field?: string;
  sort_type?: string;
  category?: string;
  country?: string;
  year?: number;
  type?: string;
} = {}): Promise<{ items: MovieListItem[]; cdnImage: string } | null> {
  try {
    const url = new URL(`${API}/movies`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    const inner = json?.data?.data;
    return {
      items: inner?.items ?? [],
      cdnImage: inner?.APP_DOMAIN_CDN_IMAGE || CDN,
    };
  } catch {
    return null;
  }
}

export async function fetchSearch(keyword: string): Promise<{ items: MovieListItem[]; cdnImage: string } | null> {
  try {
    const url = new URL(`${API}/search`);
    url.searchParams.set('keyword', keyword);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const inner = json?.data?.data;
    return {
      items: inner?.items ?? [],
      cdnImage: inner?.APP_DOMAIN_CDN_IMAGE || CDN,
    };
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.data?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchCountries(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API}/countries`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.data?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchYears(): Promise<number[]> {
  try {
    const res = await fetch(`${API}/years`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.data?.items ?? [];
  } catch {
    return [];
  }
}
