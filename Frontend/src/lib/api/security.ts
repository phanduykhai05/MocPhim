import { AUTH_BASE_URL } from "@/constants";

export interface LoginLog {
  id: string;
  email: string;
  userId: string | null;
  ip: string;
  userAgent: string | null;
  status: "success" | "failed";
  failReason: string | null;
  createdAt: string;
}

export interface SecurityAlert {
  id: string;
  type: "bruteforce" | "bruteforce_ip";
  severity: "high" | "medium" | "low";
  target: string;
  detail: string;
  detectedAt: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  type: "manual" | "scheduled";
  status: "done" | "running" | "failed";
  sizeLabel: string | null;
  errorMessage: string | null;
  triggeredBy: string | null;
  fileExists: boolean;
  createdAt: string;
}

export interface BackupFileEntry {
  name: string;
  isDirectory: boolean;
  size: number;
  sizeLabel: string;
  relativePath: string;
}

export interface BackupDirResult {
  dir: string;
  rootDir: string;
  relativePath: string;
  files: BackupFileEntry[];
}

export interface BackupFileContent {
  filename: string;
  totalLines: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  content: string;
  sizeLabel: string;
}

export interface SecuritySettings {
  enable2FA: boolean;
  detectAnomaly: boolean;
  backupSchedule: string;
  backupRetention: string;
  enableClientProtection: boolean;
  blockDevToolsKeyShortcuts: boolean;
  blockContextMenu: boolean;
  blockViewSourceShortcut: boolean;
  blockCopySelection: boolean;
  blockPrintShortcut: boolean;
  blockSaveShortcut: boolean;
  blurWhenTabHidden: boolean;
  frameBustProtection: boolean;
}

export interface SecurityStats {
  total24h: number;
  failed24h: number;
  success24h: number;
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

async function secFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; pagination?: { totalItems: number } }> {
  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return { data: json.data, pagination: json.pagination };
}

export async function apiGetSecuritySettings(): Promise<{ settings: SecuritySettings; updatedAt: string }> {
  const { data } = await secFetch<{ settings: SecuritySettings; updatedAt: string }>("/api/v1/admin/security/settings");
  return data;
}

export async function apiSaveSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
  await secFetch("/api/v1/admin/security/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export async function apiGetLoginLogs(params: {
  page?: number; size?: number; email?: string; status?: string; ip?: string;
}): Promise<PaginatedResult<LoginLog>> {
  const q = new URLSearchParams();
  q.set("page", String((params.page ?? 1) - 1));
  q.set("size", String(params.size ?? 20));
  if (params.email) q.set("email", params.email);
  if (params.status) q.set("status", params.status);
  if (params.ip) q.set("ip", params.ip);
  const { data, pagination } = await secFetch<LoginLog[]>(`/api/v1/admin/security/login-logs?${q}`);
  return { data: Array.isArray(data) ? data : [], total: pagination?.totalItems ?? 0 };
}

export async function apiGetSecurityStats(): Promise<SecurityStats> {
  const { data } = await secFetch<SecurityStats>("/api/v1/admin/security/stats");
  return data;
}

export async function apiGetSecurityAlerts(): Promise<SecurityAlert[]> {
  const { data } = await secFetch<SecurityAlert[]>("/api/v1/admin/security/alerts");
  return Array.isArray(data) ? data : [];
}

export async function apiGetBackups(params: { page?: number; size?: number }): Promise<PaginatedResult<BackupRecord>> {
  const q = new URLSearchParams();
  q.set("page", String((params.page ?? 1) - 1));
  q.set("size", String(params.size ?? 10));
  const { data, pagination } = await secFetch<BackupRecord[]>(`/api/v1/admin/security/backups?${q}`);
  return { data: Array.isArray(data) ? data : [], total: pagination?.totalItems ?? 0 };
}

export async function apiTriggerBackup(): Promise<{ id: string; filename: string }> {
  const { data } = await secFetch<{ id: string; filename: string }>("/api/v1/admin/security/backups/trigger", { method: "POST" });
  return data;
}

export async function apiDeleteBackup(id: string): Promise<void> {
  await secFetch(`/api/v1/admin/security/backups/${id}`, { method: "DELETE" });
}

export async function apiGetBackupFiles(sub?: string): Promise<BackupDirResult> {
  const q = sub ? `?sub=${encodeURIComponent(sub)}` : "";
  const { data } = await secFetch<BackupDirResult>(`/api/v1/admin/security/backup-dir${q}`);
  return data;
}

export async function apiReadBackupFile(
  rel: string,
  offset = 0,
  limit = 200,
): Promise<BackupFileContent> {
  const q = new URLSearchParams({ rel, offset: String(offset), limit: String(limit) });
  const { data } = await secFetch<BackupFileContent>(`/api/v1/admin/security/backup-file?${q}`);
  return data;
}

export async function apiDownloadBackup(id: string, filename: string): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const res = await fetch(`${AUTH_BASE_URL}/api/v1/admin/security/backups/${id}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Không thể tải file backup");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
