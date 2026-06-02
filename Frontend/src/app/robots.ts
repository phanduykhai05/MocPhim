import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://moc-phim.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/oauth2/',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/the-loai/phim-18',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
