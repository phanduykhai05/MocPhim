const API = process.env.NEXT_PUBLIC_API_URL!;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MovieSyncItem {
  id: number;
  slug: string;
  title: string;
  originName?: string;
  type?: string;
  thumbUrl?: string;
  posterUrl?: string;
  episodeCurrent?: string;
  quality?: string;
  lang?: string;
  year?: number;
  duration?: string;
  subDocquyen?: boolean;
  category?: { id: string; name: string; slug: string }[];
  country?: { id: string; name: string; slug: string }[];
  modifiedAt: string;
  createdAt: string;
}

export interface UpdateMoviePayload {
  title?: string;
  originName?: string;
  type?: string;
  quality?: string;
  lang?: string;
  year?: number;
  episodeCurrent?: string;
  duration?: string;
  thumbUrl?: string;
  posterUrl?: string;
  subDocquyen?: boolean;
}

export interface SyncPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SyncMoviesResult {
  items: MovieSyncItem[];
  pagination: SyncPagination;
}

export interface TriggerSyncResult {
  added: number;
  skipped: number;
}

export interface ResyncResult {
  updated: number;
  notFound: number;
  failed: number;
  remaining: number;
}

function authHeaders(accessToken?: string): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function buildPagination(
  totalItems: number,
  page: number,
  size: number,
): SyncPagination {
  const safeSize = Math.max(1, size);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  const currentPage = Math.min(Math.max(1, page + 1), totalPages);
  return { currentPage, totalPages, totalItems, itemsPerPage: safeSize };
}

function applyFallbackPage(
  all: MovieSyncItem[],
  page: number,
  size: number,
): SyncMoviesResult {
  const start = Math.max(0, page) * Math.max(1, size);
  return {
    items: all.slice(start, start + size),
    pagination: buildPagination(all.length, page, size),
  };
}

async function adminPost<T>(
  url: string,
  accessToken?: string,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(accessToken),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.status) return null;
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function fetchSyncMovies(
  page = 0,
  size = 20,
): Promise<SyncMoviesResult | null> {
  try {
    const res = await fetch(`${API}/sync/movies?page=${page}&size=${size}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.status) {
        const rawData = json.data;
        const items: MovieSyncItem[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.content)
            ? rawData.content
            : Array.isArray(rawData?.items)
              ? rawData.items
              : [];
        const totalCount = rawData?.totalElements ?? rawData?.total ?? rawData?.totalItems;
        const pagination =
          json.pagination ??
          (totalCount != null
            ? buildPagination(totalCount, page, size)
            : buildPagination(items.length, page, size));
        return { items, pagination };
      }
    }
    const all = await fetchSyncMoviesAll();
    return all ? applyFallbackPage(all, page, size) : null;
  } catch {
    const all = await fetchSyncMoviesAll();
    return all ? applyFallbackPage(all, page, size) : null;
  }
}

export async function fetchSyncMoviesAll(): Promise<MovieSyncItem[] | null> {
  try {
    const res = await fetch(`${API}/sync/movies/all`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.status) return null;
    return json.data ?? [];
  } catch {
    return null;
  }
}

export async function fetchSyncCount(): Promise<number | null> {
  try {
    const res = await fetch(`${API}/sync/movies/count`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.status) return null;
    return json.data ?? 0;
  } catch {
    return null;
  }
}

export async function triggerSync(
  startPage = 1,
  maxPages = 50,
  accessToken?: string,
): Promise<TriggerSyncResult | null> {
  const url = new URL(`${API}/sync/movies/trigger`);
  url.searchParams.set("startPage", String(startPage));
  url.searchParams.set("maxPages", String(maxPages));
  return adminPost<TriggerSyncResult>(url.toString(), accessToken);
}

export async function triggerResync(
  limit = 100,
  accessToken?: string,
): Promise<ResyncResult | null> {
  return adminPost<ResyncResult>(
    `${API}/sync/movies/resync?limit=${limit}`,
    accessToken,
  );
}

export async function updateMovie(
  slug: string,
  payload: UpdateMoviePayload,
  accessToken?: string,
): Promise<MovieSyncItem | null> {
  try {
    const token = accessToken ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
    const res = await fetch(`${API}/sync/movies/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.status ? json.data : null;
  } catch {
    return null;
  }
}

export async function deleteAdminCache(
  pattern: string,
  accessToken?: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API}/admin/cache/${encodeURIComponent(pattern)}`,
      {
        method: "DELETE",
        headers: authHeaders(accessToken),
        cache: "no-store",
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
