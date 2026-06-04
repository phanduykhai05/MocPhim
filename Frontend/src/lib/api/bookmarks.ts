import { AUTH_BASE_URL } from "@/constants";

export interface BookmarkItem {
  id: number;
  userId: number;
  movieId: string;
  slug: string;
  movieTitle: string;
  posterUrl: string;
  thumbUrl: string | null;
  mediaType: string;
  bookmarkDate: string;
  latestEpisode: number | null;
  positionSeconds: number | null;
  episodeCompleted: boolean | null;
  lastWatchedAt: string | null;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export async function apiAddBookmark(slug: string): Promise<BookmarkItem> {
  const json = await request<BookmarkItem>("POST", "/api/bookmarks", { slug });
  if (!json.status) throw new Error(json.message || "Không thể thêm bookmark");
  return json.data;
}

export async function apiGetBookmarks(userId: number): Promise<BookmarkItem[]> {
  const json = await request<BookmarkItem[]>("GET", `/api/bookmarks/${userId}`);
  if (!json.status) throw new Error(json.message || "Không thể lấy danh sách bookmark");
  return json.data;
}

export async function apiIsBookmarked(userId: number, movieId: string): Promise<boolean> {
  const json = await request<boolean>("GET", `/api/bookmarks/isBookmarked/${userId}/${movieId}`);
  return json.status ? json.data : false;
}

export async function apiDeleteBookmark(userId: number, movieId: string): Promise<void> {
  const json = await request<string>("DELETE", `/api/bookmarks/${userId}/${movieId}`);
  if (!json.status) throw new Error(json.message || "Không thể xóa bookmark");
}
