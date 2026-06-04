import { AUTH_BASE_URL } from "@/constants";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  enabled: boolean;
  isVerified: boolean;
  avatar?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  pagination?: BackendPagination;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data: T; pagination?: BackendPagination; message: string }> {
  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return { data: json.data, pagination: json.pagination, message: json.message };
}

// ─── Get users ────────────────────────────────────────────────────────────────

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  name?: string;
  enabled?: boolean;
}

export async function apiGetAdminUsers(
  params: GetUsersParams,
): Promise<PaginatedResult<AdminUser>> {
  const query = new URLSearchParams();
  const backendPage = params.page != null ? params.page - 1 : 0;
  query.set("page", String(backendPage));
  if (params.pageSize) query.set("size", String(params.pageSize));
  if (params.name) query.set("name", params.name);
  if (params.enabled !== undefined) query.set("enabled", String(params.enabled));

  const { data, pagination } = await adminFetch<AdminUser[]>(
    `/api/v1/admin/users?${query.toString()}`,
  );

  return {
    data: Array.isArray(data) ? data : [],
    total: pagination?.totalItems ?? 0,
  };
}

export interface RoleStats {
  admin: number;
  editor: number;
  user: number;
  total: number;
}

export async function apiGetRoleStats(): Promise<RoleStats> {
  const { data } = await adminFetch<RoleStats>("/api/v1/admin/roles/stats");
  return data;
}

// ─── Create user ──────────────────────────────────────────────────────────────

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export async function apiCreateUser(payload: CreateUserPayload): Promise<AdminUser> {
  const { data } = await adminFetch<AdminUser>("/api/v1/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

// ─── Update user ──────────────────────────────────────────────────────────────

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  roles?: string[];
}

export async function apiUpdateUser(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
  const { data } = await adminFetch<AdminUser>(`/api/v1/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data;
}

// ─── Toggle block status ──────────────────────────────────────────────────────

export async function apiToggleUserStatus(id: string, enabled: boolean): Promise<void> {
  await adminFetch(`/api/v1/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}

// ─── Delete user ──────────────────────────────────────────────────────────────

export async function apiDeleteUser(id: string): Promise<void> {
  await adminFetch(`/api/v1/admin/users/${id}`, { method: "DELETE" });
}
