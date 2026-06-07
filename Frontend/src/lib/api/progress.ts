import { AUTH_BASE_URL } from "@/constants";

export interface WatchProgress {
  userId: number;
  movieId: string;
  slug: string;
  episodeNumber: number;
  positionSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string;
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
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP_${res.status}: ${text}`);
  }

  return res.json() as Promise<ApiResponse<T>>;
}

/** Cập nhật / tạo mới tiến độ xem một tập (qua Next.js proxy để tránh CORS với PATCH) */
export async function apiUpdateProgress(
  userId: number,
  movieId: string,
  episodeNumber: number,
  payload: { slug: string; positionSeconds: number; isCompleted: boolean }
): Promise<WatchProgress | null> {
  try {
    const token = getToken();
    if (!token) throw new Error("NO_TOKEN");

    const res = await fetch(`/api/proxy/progress/${userId}/${movieId}/${episodeNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP_${res.status}: ${text}`);
    }

    const json = (await res.json()) as ApiResponse<WatchProgress>;
    return json.status ? json.data : null;
  } catch (err) {
    console.error("[WatchProgress] updateProgress failed:", err);
    return null;
  }
}

/** Lấy tiến độ của một tập cụ thể */
export async function apiGetProgress(
  userId: number,
  movieId: string,
  episodeNumber: number
): Promise<WatchProgress | null> {
  try {
    const json = await request<WatchProgress>(
      "GET",
      `/api/v1/progress/${userId}/${movieId}/${episodeNumber}`
    );
    return json.status ? json.data : null;
  } catch (err) {
    console.error("[WatchProgress] getProgress failed:", err);
    return null;
  }
}

/** Lấy điểm tiếp tục xem mới nhất của phim (dùng trên trang chi tiết) */
export async function apiGetResumePoint(
  userId: number,
  slug: string
): Promise<WatchProgress | null> {
  try {
    const json = await request<WatchProgress>(
      "GET",
      `/api/v1/progress/${userId}/resume/${slug}`
    );
    return json.status ? json.data : null;
  } catch (err) {
    console.error("[WatchProgress] getResumePoint failed:", err);
    return null;
  }
}

/** Lấy toàn bộ tiến độ xem của một phim */
export async function apiGetAllProgress(
  userId: number,
  movieId: string
): Promise<WatchProgress[]> {
  try {
    const json = await request<WatchProgress[]>(
      "GET",
      `/api/v1/progress/${userId}/${movieId}`
    );
    return json.status ? json.data : [];
  } catch (err) {
    console.error("[WatchProgress] getAllProgress failed:", err);
    return [];
  }
}
