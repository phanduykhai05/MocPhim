import { AUTH_BASE_URL } from "@/constants";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  provider: string;
  roles: string[];
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

async function apiPost<T>(
  endpoint: string,
  body: Record<string, unknown>,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return json.data;
}

export async function apiLogin(email: string, password: string): Promise<AuthTokens> {
  return apiPost<AuthTokens>("/auth/login", { email, password });
}

export async function apiRegister(
  email: string,
  password: string,
  name: string,
): Promise<AuthTokens> {
  return apiPost<AuthTokens>("/auth/register", { email, password, name });
}

export async function apiRefreshToken(refreshToken: string): Promise<AuthTokens> {
  return apiPost<AuthTokens>("/auth/refresh", { refreshToken });
}

export async function apiGetMe(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = (await res.json()) as ApiResponse<AuthUser>;
  if (!json.status) throw new Error(json.message || "Không thể lấy thông tin người dùng");
  return json.data;
}
