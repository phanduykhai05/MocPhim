import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://moc-phim.vercel.app';
const API  = process.env.NEXT_PUBLIC_AUTH_URL  || 'http://localhost:8080';

const DEFAULT_RULES: MetadataRoute.Robots = {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/oauth2/', '/login', '/forgot-password', '/reset-password'],
    },
  ],
  sitemap: `${BASE}/sitemap.xml`,
};

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const res = await fetch(`${API}/api/v1/admin/seo/robots`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return DEFAULT_RULES;
    const json = await res.json();
    const txt: string = json?.data?.robotsTxt;
    if (!txt) return DEFAULT_RULES;

    // Parse raw robots.txt text → MetadataRoute.Robots
    const lines = txt.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const disallow: string[] = [];
    const allow: string[]    = [];
    let sitemap = `${BASE}/sitemap.xml`;

    for (const line of lines) {
      if (line.startsWith('Disallow:')) disallow.push(line.replace('Disallow:', '').trim());
      else if (line.startsWith('Allow:'))   allow.push(line.replace('Allow:', '').trim());
      else if (line.startsWith('Sitemap:')) sitemap = line.replace('Sitemap:', '').trim();
    }

    return {
      rules: [{ userAgent: '*', allow: allow.length ? allow : ['/'], disallow }],
      sitemap,
    };
  } catch {
    return DEFAULT_RULES;
  }
}
