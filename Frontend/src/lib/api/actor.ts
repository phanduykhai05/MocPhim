const API = process.env.NEXT_PUBLIC_API_URL!;
const CDN = process.env.NEXT_PUBLIC_CDN_IMAGE!;

function resolveTotalPages(totalPages: number, totalItems: number, pageSize: number): number {
  if (totalPages > 1) return totalPages;
  if (totalItems > pageSize) return Math.ceil(totalItems / pageSize);
  return totalPages;
}

export function getActorThumb(thumb_url: string, cdn = CDN): string {
  if (!thumb_url) return '';
  if (thumb_url.startsWith('http')) return thumb_url;
  return `${cdn}/uploads/movies/${thumb_url}`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ActorListItem {
  _id?: string;
  name: string;
  slug: string;
  thumb_url?: string;
  poster_url?: string;
}

export interface ActorMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url?: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category?: { id: string; name: string; slug: string }[];
}

export interface ActorListResult {
  items: ActorListItem[];
  cdnImage: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ActorMoviesResult {
  actorName: string;
  actorSlug: string;
  items: ActorMovie[];
  cdnImage: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function fetchActorList(page = 1): Promise<ActorListResult | null> {
  try {
    const res = await fetch(`${API}/actors?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const topData = json?.data;
    const inner = topData?.data;
    const items: ActorListItem[] = Array.isArray(inner?.items)
      ? inner.items
      : Array.isArray(topData?.items)
      ? topData.items
      : [];
    const totalItems = json?.pagination?.totalItems ?? inner?.params?.pagination?.totalItems ?? items.length;
    const rawTotal = json?.pagination?.totalPages ?? inner?.params?.pagination?.totalPages ?? 1;
    const pageSize = Number(inner?.params?.pagination?.totalItemsPerPage ?? 20);
    return {
      items,
      cdnImage: inner?.APP_DOMAIN_CDN_IMAGE || topData?.APP_DOMAIN_CDN_IMAGE || CDN,
      totalItems,
      totalPages: resolveTotalPages(rawTotal, totalItems, pageSize),
      currentPage: page,
    };
  } catch {
    return null;
  }
}

export async function fetchActorMovies(
  slug: string,
  params: { page?: number; size?: number; sort_field?: string; sort_type?: string } = {},
): Promise<ActorMoviesResult | null> {
  try {
    const url = new URL(`${API}/actors/${slug}/movies`);
    if (params.page)       url.searchParams.set('page', String(params.page));
    if (params.size)       url.searchParams.set('size', String(params.size));
    if (params.sort_field) url.searchParams.set('sort_field', params.sort_field);
    if (params.sort_type)  url.searchParams.set('sort_type', params.sort_type);

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    const topData = json?.data;
    const inner = topData?.data;

    const items: ActorMovie[] = Array.isArray(inner?.items)
      ? inner.items
      : Array.isArray(topData?.items)
      ? topData.items
      : [];

    const totalItems = json?.pagination?.totalItems ?? inner?.params?.pagination?.totalItems ?? items.length;
    const rawTotal = json?.pagination?.totalPages ?? inner?.params?.pagination?.totalPages ?? 1;
    const pageSize = Number(params.size ?? inner?.params?.pagination?.totalItemsPerPage ?? 20);

    const actorName: string =
      inner?.titlePage?.replace(/^phim.*?:\s*/i, '').trim() ||
      topData?.titlePage?.replace(/^phim.*?:\s*/i, '').trim() ||
      slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      actorName,
      actorSlug: slug,
      items,
      cdnImage: inner?.APP_DOMAIN_CDN_IMAGE || topData?.APP_DOMAIN_CDN_IMAGE || CDN,
      totalItems,
      totalPages: resolveTotalPages(rawTotal, totalItems, pageSize),
      currentPage: params.page ?? 1,
    };
  } catch {
    return null;
  }
}
