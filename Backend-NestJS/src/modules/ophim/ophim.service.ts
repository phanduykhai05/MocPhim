import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OphimService {
  private readonly client: AxiosInstance;
  private readonly logger = new Logger(OphimService.name);

  constructor(config: ConfigService) {
    this.client = axios.create({
      baseURL: config.get<string>('OPHIM_BASE_URL', 'https://ophim1.com/v1/api'),
      timeout: 10000,
    });
  }

  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    try {
      const res = await this.client.get<T>(path, { params });
      return res.data;
    } catch (err: any) {
      this.logger.error(`OPhim API error [${path}]: ${err.message}`);
      throw new HttpException(
        `OPhim API error: ${err.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Home page data
  async getHome() {
    return this.get('/home');
  }

  // Movie list by list type
  async getMovieList(list: string, params?: Record<string, any>) {
    return this.get(`/danh-sach/${list}`, params);
  }

  // Movie detail by slug
  async getMovieDetail(slug: string) {
    return this.get(`/phim/${slug}`);
  }

  // Search
  async search(keyword: string, params?: Record<string, any>) {
    return this.get('/tim-kiem', { keyword, ...params });
  }

  // Category movies
  async getCategoryMovies(slug: string, params?: Record<string, any>) {
    return this.get(`/the-loai/${slug}`, params);
  }

  // Country movies
  async getCountryMovies(slug: string, params?: Record<string, any>) {
    return this.get(`/quoc-gia/${slug}`, params);
  }

  // Year movies
  async getYearMovies(year: string, params?: Record<string, any>) {
    return this.get(`/nam-phat-hanh/${year}`, params);
  }
}
