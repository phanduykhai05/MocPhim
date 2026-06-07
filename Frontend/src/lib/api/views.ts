import { AUTH_BASE_URL } from "@/constants";

export interface ViewCount {
  viewCount: number;
  viewCountToday: number;
}

interface ViewApiResponse {
  status: boolean;
  data: ViewCount;
}

interface BatchViewApiResponse {
  status: boolean;
  data: Record<string, number>;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function apiRecordView(slug: string): Promise<ViewCount | null> {
  try {
    const token = getToken();
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/${slug}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json: ViewApiResponse = await res.json();
    return json.status ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiGetViewCount(slug: string): Promise<ViewCount | null> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/${slug}`);
    const json: ViewApiResponse = await res.json();
    return json.status ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiGetViewStatsToday(): Promise<number> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/stats/today`);
    const json: { status: boolean; data: { total: number } } = await res.json();
    return json.status ? (json.data?.total ?? 0) : 0;
  } catch {
    return 0;
  }
}

export async function apiGetBatchViewCounts(
  slugs: string[]
): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  try {
    const res = await fetch(
      `${AUTH_BASE_URL}/api/v1/views/batch?slugs=${slugs.join(",")}`
    );
    const json: BatchViewApiResponse = await res.json();
    return json.status ? json.data : {};
  } catch {
    return {};
  }
}
