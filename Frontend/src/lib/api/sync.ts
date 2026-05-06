const API = process.env.NEXT_PUBLIC_API_URL!;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MovieSyncItem {
  id: number;
  slug: string;
  title: string;
  originName?: string;
  type?: string;
  thumbUrl?: string;
  episodeCurrent?: string;
  quality?: string;
  lang?: string;
  year?: number;
  duration?: string;
  category?: { id: string; name: string; slug: string }[];
  country?: { id: string; name: string; slug: string }[];
  modifiedAt: string;
  createdAt: string;
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

function buildPagination(totalItems: number, page: number, size: number): SyncPagination {
  const safeSize = Math.max(1, size);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  const currentPage = Math.min(Math.max(1, page + 1), totalPages);
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: safeSize,
  };
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/** GET /sync/movies — danh sách phim đã sync (phân trang) */
export async function fetchSyncMovies(
  page = 0,
  size = 20
): Promise<SyncMoviesResult | null> {
  try {
    const res = await fetch(`${API}/sync/movies/all`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.status) {
        const rawItems = Array.isArray(json.data) ? json.data : [];
        const pagination = json.pagination ?? buildPagination(rawItems.length, page, size);
        if (json.pagination) {
          return { items: rawItems, pagination };
        }

        const start = Math.max(0, page) * Math.max(1, size);
        const end = start + Math.max(1, size);
        return {
          items: rawItems.slice(start, end),
          pagination,
        };
      }
    }

    const allFallback = await fetchSyncMoviesAll();
    if (!allFallback) return null;
    const start = Math.max(0, page) * Math.max(1, size);
    const end = start + Math.max(1, size);
    return {
      items: allFallback.slice(start, end),
      pagination: buildPagination(allFallback.length, page, size),
    };
  } catch {
    const allFallback = await fetchSyncMoviesAll();
    if (!allFallback) return null;
    const start = Math.max(0, page) * Math.max(1, size);
    const end = start + Math.max(1, size);
    return {
      items: allFallback.slice(start, end),
      pagination: buildPagination(allFallback.length, page, size),
    };
  }
}

/** GET /sync/movies/all — tối đa 500 phim mới nhất */
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

/** GET /sync/movies/count — tổng số phim đã sync */
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

/** POST /sync/movies/trigger — kích hoạt sync thủ công */
export async function triggerSync(
  startPage = 1,
  maxPages = 50
): Promise<TriggerSyncResult | null> {
  try {
    const url = new URL(`${API}/sync/movies/trigger`);
    url.searchParams.set('startPage', String(startPage));
    url.searchParams.set('maxPages', String(maxPages));
    const res = await fetch(url.toString(), {
      method: 'POST',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.status) return null;
    return json.data ?? null;
  } catch {
    return null;
  }
}
