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
  avatar: string | null;
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthTokens> {
  return apiPost<AuthTokens>("/auth/login", { email, password });
}

/** Returns the confirmation message — user must verify email before logging in */
export async function apiRegister(
  email: string,
  password: string,
  name: string,
): Promise<string> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const json = (await res.json()) as ApiResponse<null>;
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return json.message;
}

export async function apiRefreshToken(
  refreshToken: string,
): Promise<AuthTokens> {
  return apiPost<AuthTokens>("/auth/refresh", { refreshToken });
}

export async function apiGetMe(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:unauthorized"));
    throw new Error("Tài khoản không hợp lệ hoặc đã bị khoá");
  }
  const json = (await res.json()) as ApiResponse<AuthUser>;
  if (!json.status)
    throw new Error(json.message || "Không thể lấy thông tin người dùng");
  return json.data;
}

export async function apiLogout(accessToken?: string): Promise<void> {
  try {
    await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  } catch {
    // ignore — tokens will be cleared client-side regardless
  }
}

export async function apiForgotPassword(email: string): Promise<void> {
  await apiPost<null>("/auth/forgot-password", { email });
}

export async function apiResetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await apiPost<null>("/auth/reset-password", { token, newPassword });
}
