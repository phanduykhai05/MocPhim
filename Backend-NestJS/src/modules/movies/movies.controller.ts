import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OphimService } from '../ophim/ophim.service';
import { MovieSync } from '../../entities/movie-sync.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

/** Map MovieSync overrides onto an OPhim item object (only non-null fields). */
function applyLocalOverrides(item: Record<string, any>, local: MovieSync): void {
  if (local.title)          item.name            = local.title;
  if (local.originName)     item.origin_name      = local.originName;
  if (local.type)           item.type             = local.type;
  if (local.quality)        item.quality          = local.quality;
  if (local.lang)           item.lang             = local.lang;
  if (local.year)           item.year             = local.year;
  if (local.episodeCurrent) item.episode_current  = local.episodeCurrent;
  if (local.duration)       item.time             = local.duration;
  if (local.thumbUrl)       item.thumb_url        = local.thumbUrl;
  if (local.posterUrl)      item.poster_url       = local.posterUrl;
  if (local.subDocquyen != null) item.sub_docquyen = local.subDocquyen;
}

@ApiTags('Movies')
@Controller('api/v1')
export class MoviesController {
  constructor(
    private ophim: OphimService,
    @InjectRepository(MovieSync) private syncRepo: Repository<MovieSync>,
  ) {}

  @Get('home')
  @ApiOperation({ summary: 'Dữ liệu trang chủ từ OPhim (items có ảnh desktop/mobile)' })
  async home() {
    const data = await this.ophim.getHome();
    // OPhim home thường chỉ trả thumb_url. Bổ sung poster_url và ảnh responsive
    // theo naming convention: *-poster.jpg cho desktop, *-thumb.jpg cho mobile.
    const items: any[] = data?.data?.items ?? [];
    for (const item of items) {
      const thumbUrl = item.thumb_url ?? this.toThumbUrl(item.poster_url);
      const posterUrl = item.poster_url ?? this.toPosterUrl(item.thumb_url);

      if (thumbUrl) item.thumb_url = thumbUrl;
      if (posterUrl) item.poster_url = posterUrl;

      item.image_url = {
        desktop: posterUrl ?? thumbUrl ?? null,
        mobile: thumbUrl ?? posterUrl ?? null,
      };
      item.image_urls = item.image_url;
    }
    return ApiResponse.ok(data);
  }

  @Get('movies/all')
  @ApiOperation({ summary: 'Lấy tất cả phim (tối đa 500) theo danh sách' })
  @ApiQuery({ name: 'list', required: true, example: 'phim-moi', description: 'Loại danh sách: phim-moi, phim-le, phim-bo...' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'type', required: false })
  async getMoviesAll(@Query() q: Record<string, any>) {
    const { list, sort_field, sort_type, category, country, year, type } = q;
    const params = this.buildParams(1, 500, sort_field, sort_type, category, country, year, type);
    const data = await this.ophim.getMovieList(list ?? 'phim-moi', params);
    return ApiResponse.ok(data);
  }

  @Get('movies')
  @ApiOperation({ summary: 'Lấy danh sách phim có phân trang' })
  @ApiQuery({ name: 'list', required: true, example: 'phim-moi' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20, description: 'Tối đa 100' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'type', required: false })
  async getMovies(@Query() q: Record<string, any>) {
    const { list, page = 1, size = 20, sort_field, sort_type, category, country, year, type } = q;
    const safeSize = Math.min(Math.max(Number(size), 1), 100);
    const params = this.buildParams(Number(page), safeSize, sort_field, sort_type, category, country, year, type);
    const data = await this.ophim.getMovieList(list ?? 'phim-moi', params);
    const p = data?.data?.params?.pagination ?? data?.params?.pagination;
    const pagination = p ? { currentPage: Number(p.currentPage), totalPages: Number(p.totalPages), totalItems: Number(p.totalItems), itemsPerPage: Number(p.totalItemsPerPage) } : undefined;
    return ApiResponse.ok(data, 'Success', pagination);
  }

  @Get('movies/:slug/images')
  @ApiOperation({ summary: 'Ảnh gallery của phim' })
  @ApiParam({ name: 'slug', example: 'one-piece' })
  async getMovieImages(@Param('slug') slug: string) {
    const data = await this.ophim.get(`/phim/${slug}/images`);
    return ApiResponse.ok(data);
  }

  @Get('movies/:slug/peoples')
  @ApiOperation({ summary: 'Diễn viên, đạo diễn của phim' })
  @ApiParam({ name: 'slug', example: 'one-piece' })
  async getMoviePeoples(@Param('slug') slug: string) {
    const data = await this.ophim.get(`/phim/${slug}/peoples`);
    return ApiResponse.ok(data);
  }

  @Get('movies/:slug/keywords')
  @ApiOperation({ summary: 'Keywords/tags của phim' })
  @ApiParam({ name: 'slug', example: 'one-piece' })
  async getMovieKeywords(@Param('slug') slug: string) {
    const data = await this.ophim.get(`/phim/${slug}/keywords`);
    return ApiResponse.ok(data);
  }

  @Get('movies/:slug')
  @ApiOperation({ summary: 'Chi tiết phim theo slug (merge local overrides)' })
  @ApiParam({ name: 'slug', example: 'one-piece' })
  async getMovie(@Param('slug') slug: string) {
    const [data, local] = await Promise.all([
      this.ophim.getMovieDetail(slug),
      this.syncRepo.findOne({ where: { slug } }),
    ]);

    if (local) {
      const item = data?.data?.item ?? data?.item;
      if (item) applyLocalOverrides(item, local);
    }

    return ApiResponse.ok(data);
  }

  private buildParams(
    page: number, limit: number,
    sortField?: string, sortType?: string,
    category?: string, country?: string,
    year?: string | number, type?: string,
  ): Record<string, string> {
    const p: Record<string, string> = { page: String(page), limit: String(limit) };
    if (sortField) p.sort_field = sortField;
    if (sortType)  p.sort_type  = sortType;
    if (category)  p.category   = category;
    if (country)   p.country    = country;
    if (year)      p.year       = String(year);
    if (type)      p.type       = type;
    return p;
  }

  private toPosterUrl(url?: string): string | undefined {
    return this.replaceImageVariant(url, 'poster');
  }

  private toThumbUrl(url?: string): string | undefined {
    return this.replaceImageVariant(url, 'thumb');
  }

  private replaceImageVariant(url?: string, variant?: 'poster' | 'thumb'): string | undefined {
    if (!url || !variant) return undefined;
    return url.replace(/-(thumb|thump|poster)(\.[^./?]+)(\?.*)?$/i, `-${variant}$2$3`);
  }
}
