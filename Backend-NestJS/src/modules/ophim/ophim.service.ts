import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CacheService } from '../cache/cache.service';

// TTL per path prefix (seconds)
const TTL_MAP: [string, number][] = [
  ['/tim-kiem', 60],       // search: 1 min
  ['/home', 120],          // home: 2 min
  ['/danh-sach', 180],     // lists: 3 min
  ['/phim', 300],          // detail: 5 min
  ['/dien-vien', 300],     // actors: 5 min
  ['/the-loai', 600],      // categories: 10 min
  ['/quoc-gia', 600],      // countries: 10 min
  ['/nam-phat-hanh', 600], // years: 10 min
];

function getTtl(path: string): number {
  for (const [prefix, ttl] of TTL_MAP) {
    if (path.startsWith(prefix)) return ttl;
  }
  return 120;
}

@Injectable()
export class OphimService {
  private readonly client: AxiosInstance;
  private readonly logger = new Logger(OphimService.name);

  constructor(
    config: ConfigService,
    private readonly cache: CacheService,
  ) {
    this.client = axios.create({
      baseURL: config.get<string>('OPHIM_BASE_URL', 'https://ophim1.com/v1/api'),
      timeout: 10000,
    });
  }

  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const cacheKey = params
      ? `ophim:${path}:${JSON.stringify(params)}`
      : `ophim:${path}`;

    const cached = await this.cache.get<T>(cacheKey);
    if (cached !== null) return cached;

    try {
      const res = await this.client.get<T>(path, { params });
      await this.cache.set(cacheKey, res.data, getTtl(path));
      return res.data;
    } catch (err: any) {
      this.logger.error(`OPhim API error [${path}]: ${err.message}`);
      throw new HttpException(
        `OPhim API error: ${err.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getHome() {
    return this.get('/home');
  }

  async getMovieList(list: string, params?: Record<string, any>) {
    return this.get(`/danh-sach/${list}`, params);
  }

  async getMovieDetail(slug: string) {
    return this.get(`/phim/${slug}`);
  }

  async search(keyword: string, params?: Record<string, any>) {
    return this.get('/tim-kiem', { keyword, ...params });
  }

  async getCategoryMovies(slug: string, params?: Record<string, any>) {
    return this.get(`/the-loai/${slug}`, params);
  }

  async getCountryMovies(slug: string, params?: Record<string, any>) {
    return this.get(`/quoc-gia/${slug}`, params);
  }

  async getYearMovies(year: string, params?: Record<string, any>) {
    return this.get(`/nam-phat-hanh/${year}`, params);
  }

  async getActorMovies(slug: string, params?: Record<string, any>) {
    return this.get(`/dien-vien/${slug}`, params);
  }

  // Invalidate all cached OPhim data (call after sync)
  async invalidateAll() {
    await this.cache.del('ophim:*');
  }
}
