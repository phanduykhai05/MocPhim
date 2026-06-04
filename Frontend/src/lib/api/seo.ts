import { AUTH_BASE_URL } from "@/constants";

export interface SeoSettings {
  meta: {
    siteTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string;
    canonicalDomain: string;
    defaultRobotsMeta: string;
    autoCanonical: boolean;
    autoOpenGraph: boolean;
    autoTwitterCard: boolean;
  };
  sitemap: {
    enableSitemap: boolean;
    includeImageSitemap: boolean;
    includeVideoSitemap: boolean;
    sitemapSplitSize: string;
    pingSearchEngine: boolean;
  };
  robots: {
    robotsMode: string;
    robotsTxt: string;
  };
  urlOptimization: {
    urlPatternMovie: string;
    urlPatternEpisode: string;
    forceLowercaseSlug: boolean;
    removeStopWords: boolean;
    maxSlugLength: string;
    redirectOldSlug: boolean;
  };
  schema: {
    enableSchema: boolean;
    schemaOrgName: string;
    schemaLogo: string;
    enableBreadcrumbSchema: boolean;
    enableMovieSchema: boolean;
    enableVideoSchema: boolean;
  };
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

async function seoFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Đã có lỗi xảy ra");
  return json.data as T;
}

export async function apiGetSeoSettings(): Promise<{ settings: SeoSettings; updatedAt: string }> {
  return seoFetch("/api/v1/admin/seo/settings");
}

import { triggerRevalidate } from "@/lib/revalidate";

export async function apiSaveSeoSection(
  section: keyof SeoSettings,
  data: Record<string, unknown>,
): Promise<void> {
  await seoFetch("/api/v1/admin/seo/settings", {
    method: "PUT",
    body: JSON.stringify({ section, data }),
  });
  // Flush Next.js cache ngay để metadata áp dụng trên toàn site
  await triggerRevalidate(["/"]);
}
