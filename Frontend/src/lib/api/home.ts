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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://103.229.53.17/api/v1";
const CDN_IMAGE = process.env.APP_DOMAIN_CDN_IMAGE || "https://img.ophim.live";

export function getThumbUrl(thumb_url: string, cdn?: string): string {
  return `${cdn || CDN_IMAGE}/uploads/movies/${thumb_url}`;
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
      domainFrontend: inner.APP_DOMAIN_FRONTEND || "https://ophim17.cc",
    };
  } catch {
    return null;
  }
}
