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

/**
 * GET /home
 * Backend wraps OPhim response in ApiResponse:
 *   { status, message, data: <OPhim body>, pagination: null }
 * OPhim /home returns:
 *   { status, msg, data: { items, APP_DOMAIN_CDN_IMAGE, APP_DOMAIN_FRONTEND } }
 * So to access items: json.data.data.items
 */
export async function fetchHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetch(`${API_URL}/home`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // json.data = OPhim raw response → json.data.data = OPhim inner data
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
