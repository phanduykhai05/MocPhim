import { AUTH_BASE_URL } from "@/constants";

export interface CommentItem {
  id: number;
  movieSlug: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  isSpoiler: boolean;
  parentId: number | null;
  upvotes: number;
  downvotes: number;
  status: "approved" | "pending" | "spam";
  createdAt: string;
  updatedAt: string;
  replies?: CommentItem[];
  userVote?: "up" | "down" | null;
}

export interface CommentsResult {
  comments: CommentItem[];
  total: number;
  page: number;
  size: number;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
  pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number };
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

export async function apiGetComments(
  slug: string,
  page = 0,
  size = 10,
  userId?: string,
): Promise<CommentsResult> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (userId) params.set("userId", userId);
    const json = await request<CommentsResult>("GET", `/api/v1/comments/${slug}?${params}`);
    return json.status ? json.data : { comments: [], total: 0, page, size };
  } catch {
    return { comments: [], total: 0, page, size };
  }
}

export async function apiPostComment(
  slug: string,
  content: string,
  isSpoiler = false,
  parentId?: number,
): Promise<CommentItem | null> {
  try {
    const json = await request<CommentItem>("POST", `/api/v1/comments/${slug}`, {
      content, isSpoiler, parentId,
    });
    if (!json.status) throw new Error(json.message);
    return json.data;
  } catch (err) {
    throw err;
  }
}

export async function apiVoteComment(
  id: number,
  voteType: "up" | "down",
): Promise<CommentItem | null> {
  try {
    const json = await request<CommentItem>("POST", `/api/v1/comments/${id}/vote`, { voteType });
    return json.status ? json.data : null;
  } catch { return null; }
}

export async function apiDeleteComment(id: number): Promise<boolean> {
  try {
    const json = await request<any>("DELETE", `/api/v1/comments/${id}`);
    return json.status;
  } catch { return false; }
}

// Admin
export async function apiAdminGetComments(
  page = 0,
  size = 20,
  status?: string,
): Promise<{ data: CommentItem[]; total: number }> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    const json = await request<CommentItem[]>("GET", `/api/v1/comments/admin/all?${params}`);
    return {
      data: json.status && Array.isArray(json.data) ? json.data : [],
      total: json.pagination?.totalItems ?? 0,
    };
  } catch { return { data: [], total: 0 }; }
}

export async function apiAdminUpdateCommentStatus(
  id: number,
  status: "approved" | "pending" | "spam",
): Promise<boolean> {
  try {
    const json = await request<any>("PATCH", `/api/v1/comments/admin/${id}/status`, { status });
    return json.status;
  } catch { return false; }
}

// View count
export async function apiIncrementView(slug: string): Promise<number> {
  try {
    const json = await request<{ viewCount: number }>("POST", `/api/v1/views/${slug}`);
    return json.status ? json.data.viewCount : 0;
  } catch { return 0; }
}

export async function apiGetViewCount(slug: string): Promise<number> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/${slug}`);
    const json = await res.json();
    return json.status ? json.data.viewCount : 0;
  } catch { return 0; }
}

export async function apiGetViewsBatch(slugs: string[]): Promise<Record<string, number>> {
  try {
    if (!slugs.length) return {};
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/batch?slugs=${slugs.join(',')}`);
    const json = await res.json();
    return json.status ? json.data : {};
  } catch { return {}; }
}

export async function apiGetTodayViews(): Promise<number> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/views/stats/today`);
    const json = await res.json();
    return json.status ? json.data.total : 0;
  } catch { return 0; }
}
