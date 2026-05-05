export interface ApiMovie {
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
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
}

interface HomeApiData {
  items: ApiMovie[];
  APP_DOMAIN_CDN_IMAGE: string;
  APP_DOMAIN_FRONTEND: string;
}

interface HomeApiResponse {
  status: boolean;
  data: {
    data: HomeApiData;
  };
}

export interface HomeData {
  items: ApiMovie[];
  cdnImage: string;
  domainFrontend: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const CDN_IMAGE = process.env.NEXT_PUBLIC_CDN_IMAGE!;
const DOMAIN_FRONTEND = process.env.NEXT_PUBLIC_DOMAIN_FRONTEND!;

export function getThumbUrl(thumb_url: string, cdn?: string): string {
  return `${cdn || CDN_IMAGE}/uploads/movies/${thumb_url}`;
}

export interface HistoryItem {
  id: number;
  slug: string;
  title: string;
  modifiedAt: string;
  createdAt: string;
}

export interface HistoryPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface HistoryData {
  items: HistoryItem[];
  pagination: HistoryPagination;
}

export async function fetchHistory(page = 0, size = 24): Promise<HistoryData | null> {
  try {
    const res = await fetch(`${API_URL}/history?page=${page}&size=${size}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.status) return null;
    return {
      items: json.data ?? [],
      pagination: json.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: size },
    };
  } catch {
    return null;
  }
}

export async function fetchHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetch(`${API_URL}/home`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json: HomeApiResponse = await res.json();
    const inner = json?.data?.data;
    if (!inner) return null;
    return {
      items: inner.items ?? [],
      cdnImage: inner.APP_DOMAIN_CDN_IMAGE || CDN_IMAGE,
      domainFrontend: inner.APP_DOMAIN_FRONTEND || DOMAIN_FRONTEND,
    };
  } catch {
    return null;
  }
}
