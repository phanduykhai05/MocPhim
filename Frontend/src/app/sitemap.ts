import type { MetadataRoute } from 'next';
import { fetchCategories, fetchCountries, fetchYears, fetchMovieList } from '@/lib/api/movie';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://moc-phim.vercel.app';
const MOVIES_PER_PAGE = 200;

export async function generateSitemaps() {
  const data = await fetchMovieList({ page: 1, size: 1, sort_field: 'modified_time', sort_type: 'desc' });
  const totalPages = Math.max(1, Math.ceil((data?.totalItems ?? 0) / MOVIES_PER_PAGE));
  return Array.from({ length: totalPages + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  if (id === 0) {
    const [categories, countries, years] = await Promise.all([
      fetchCategories(),
      fetchCountries(),
      fetchYears(),
    ]);

    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
      { url: BASE,                            lastModified: now, changeFrequency: 'daily',  priority: 1.0 },
      { url: `${BASE}/phimmoi`,               lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
      { url: `${BASE}/phim-le`,               lastModified: now, changeFrequency: 'daily',  priority: 0.8 },
      { url: `${BASE}/phim-bo`,               lastModified: now, changeFrequency: 'daily',  priority: 0.8 },
      { url: `${BASE}/phimmoi/full-movies`,   lastModified: now, changeFrequency: 'daily',  priority: 0.7 },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((c) => c.slug !== 'phim-18')
      .map((c) => ({
        url: `${BASE}/the-loai/${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    const countryRoutes: MetadataRoute.Sitemap = countries.map((c) => ({
      url: `${BASE}/quoc-gia/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const yearRoutes: MetadataRoute.Sitemap = (years as (number | string)[]).map((y) => ({
      url: `${BASE}/nam-phat-hanh/${y}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

    return [...staticRoutes, ...categoryRoutes, ...countryRoutes, ...yearRoutes];
  }

  const data = await fetchMovieList({
    page: id,
    size: MOVIES_PER_PAGE,
    sort_field: 'modified_time',
    sort_type: 'desc',
  });

  return (data?.items ?? []).map((movie) => ({
    url: `${BASE}/phim/${movie.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}
