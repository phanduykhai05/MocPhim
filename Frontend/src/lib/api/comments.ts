import { AUTH_BASE_URL } from "@/constants";

export interface CommentItem {
  id: number;
  movieSlug: string;
  userId: number;
  userName: string;
  userAvatar: string | null;
  content: string;
  isSpoiler: boolean;
  parentId: number | null;
  upvotes: number;
  downvotes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  userVote: "up" | "down" | null;
  replies: CommentItem[];
}

interface ListApiResponse {
  status: boolean;
  message?: string;
  data: {
    comments: CommentItem[];
    total: number;
    page: number;
    size: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface SingleApiResponse {
  status: boolean;
  message?: string;
  data: CommentItem;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function apiGetComments(
  slug: string,
  page = 0,
  size = 10
): Promise<{ comments: CommentItem[]; total: number }> {
  try {
    const token = getToken();
    const res = await fetch(
      `${AUTH_BASE_URL}/api/v1/comments/${slug}?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    const json: ListApiResponse = await res.json();
    if (!json.status) return { comments: [], total: 0 };
    const comments = Array.isArray(json.data?.comments) ? json.data.comments : [];
    return {
      comments,
      total: json.pagination?.totalItems ?? json.data?.total ?? comments.length,
    };
  } catch {
    return { comments: [], total: 0 };
  }
}

export async function apiPostComment(
  slug: string,
  content: string,
  isSpoiler: boolean,
  parentId?: number
): Promise<CommentItem | null> {
  try {
    const token = getToken();
    if (!token) return null;
    const body: Record<string, unknown> = { content, isSpoiler };
    if (parentId !== undefined) body.parentId = parentId;
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/comments/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json: SingleApiResponse = await res.json();
    return json.status ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiVoteComment(
  id: number,
  voteType: "up" | "down"
): Promise<{ upvotes: number; downvotes: number; userVote: "up" | "down" | null } | null> {
  try {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/comments/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteType }),
    });
    const json: SingleApiResponse = await res.json();
    if (!json.status) return null;
    const { upvotes, downvotes, userVote } = json.data;
    return { upvotes, downvotes, userVote };
  } catch {
    return null;
  }
}

export async function apiDeleteComment(id: number): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return json.status === true;
  } catch {
    return false;
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────

export interface AdminCommentItem {
  id: number;
  movieSlug: string;
  userId: number;
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
}

interface AdminListApiResponse {
  status: boolean;
  data: AdminCommentItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export async function apiAdminGetComments(
  page = 0,
  size = 20,
  status?: string
): Promise<{ comments: AdminCommentItem[]; total: number }> {
  try {
    const token = getToken();
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    const res = await fetch(
      `${AUTH_BASE_URL}/api/v1/comments/admin/all?${params}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    const json: AdminListApiResponse = await res.json();
    if (!json.status) return { comments: [], total: 0 };
    const comments = Array.isArray(json.data) ? json.data : [];
    return {
      comments,
      total: json.pagination?.totalItems ?? comments.length,
    };
  } catch {
    return { comments: [], total: 0 };
  }
}

export async function apiAdminUpdateCommentStatus(
  id: number,
  status: "approved" | "pending" | "spam"
): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;
    const res = await fetch(`${AUTH_BASE_URL}/api/v1/comments/admin/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    return json.status === true;
  } catch {
    return false;
  }
}
