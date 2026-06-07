import { AUTH_BASE_URL } from "@/constants";

export interface AdminUser {
  id: number;
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

async function adminGet<T>(
  endpoint: string,
): Promise<{ data: T; pagination?: BackendPagination }> {
  const token = getAccessToken();
  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return { data: json.data, pagination: json.pagination };
}

export interface GetUsersParams {
  /** 1-based page number (ProTable convention) */
  page?: number;
  pageSize?: number;
  name?: string;
}

export async function apiGetAdminUsers(
  params: GetUsersParams,
): Promise<PaginatedResult<AdminUser>> {
  const query = new URLSearchParams();
  // Backend uses 0-based page index
  const backendPage = params.page != null ? params.page - 1 : 0;
  query.set("page", String(backendPage));
  if (params.pageSize) query.set("size", String(params.pageSize));
  if (params.name) query.set("name", params.name);

  const { data, pagination } = await adminGet<AdminUser[]>(
    `/api/v1/admin/users?${query.toString()}`,
  );

  return {
    data: Array.isArray(data) ? data : [],
    total: pagination?.totalItems ?? 0,
  };
}
