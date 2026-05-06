const API = process.env.NEXT_PUBLIC_API_URL!;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MovieSyncItem {
  id: number;
  slug: string;
  title: string;
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

// ─── API Functions ─────────────────────────────────────────────────────────────

/** GET /sync/movies — danh sách phim đã sync (phân trang) */
export async function fetchSyncMovies(
  page = 0,
  size = 20
): Promise<SyncMoviesResult | null> {
  try {
    const res = await fetch(`${API}/sync/movies?page=${page}&size=${size}`, {
      next: { revalidate: 120 },
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
