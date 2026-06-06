import { Controller, Get, Post, Delete, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OphimService } from '../ophim/ophim.service';
import { SyncService } from '../sync/sync.service';
import { MovieSync } from '../../entities/movie-sync.entity';
import { ActorPhoto } from '../../entities/actor-photo.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Actors')
@Controller('api/v1/actors')
export class ActorsController {
  private readonly logger = new Logger(ActorsController.name);

  constructor(
    private ophim: OphimService,
    private syncService: SyncService,
    @InjectRepository(MovieSync) private movieRepo: Repository<MovieSync>,
    @InjectRepository(ActorPhoto) private photoRepo: Repository<ActorPhoto>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách diễn viên (từ DB, phân trang)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 40 })
  @ApiQuery({ name: 'keyword', required: false, description: 'Tìm kiếm theo tên' })
  async getAll(@Query() q: Record<string, any>) {
    const page = Math.max(1, Number(q.page) || 1);
    const size = Math.min(Math.max(1, Number(q.size) || 40), 100);
    const keyword: string = q.keyword?.trim() ?? '';

    let rawQuery = `
      SELECT DISTINCT TRIM(actor_name) AS name
      FROM movie_sync,
           jsonb_array_elements_text(actor) AS actor_name
      WHERE actor IS NOT NULL
        AND actor_name IS NOT NULL
        AND TRIM(actor_name) != ''
    `;
    const params: any[] = [];

    if (keyword) {
      params.push(`%${keyword}%`);
      rawQuery += ` AND LOWER(TRIM(actor_name)) LIKE LOWER($${params.length})`;
    }

    rawQuery += ` ORDER BY name ASC`;

    const rows: { name: string }[] = await this.movieRepo.query(rawQuery, params);

    const slugMap = new Map<string, { name: string; slug: string }>();
    for (const row of rows) {
      const slug = this.toSlug(row.name);
      if (slug && !slugMap.has(slug)) slugMap.set(slug, { name: row.name, slug });
    }
    const all = Array.from(slugMap.values());

    const totalItems = all.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * size;
    const pageItems = all.slice(start, start + size);

    // Batch-fetch photos for this page
    const slugs = pageItems.map((a) => a.slug);
    let photoMap = new Map<string, string>();
    if (slugs.length > 0) {
      const photos = await this.photoRepo
        .createQueryBuilder('p')
        .where('p.actorSlug IN (:...slugs)', { slugs })
        .getMany();
      photoMap = new Map(photos.map((p) => [p.actorSlug, p.photoUrl]));
    }

    const items = pageItems.map((item) => ({
      ...item,
      thumb_url: photoMap.get(item.slug) ?? null,
    }));

    return ApiResponse.ok(
      { items },
      'Success',
      { currentPage: safePage, totalPages, totalItems, itemsPerPage: size },
    );
  }

  @Post('sync-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Sync diễn viên + ảnh cùng lúc (background)' })
  @ApiQuery({ name: 'actorLimit', required: false, example: 500, description: 'Số phim fetch actor' })
  @ApiQuery({ name: 'photoLimit', required: false, example: 100, description: 'Số diễn viên fetch ảnh' })
  async syncAll(@Query() q: Record<string, any>) {
    const actorLimit = Math.min(Number(q.actorLimit) || 500, 5000);
    const photoLimit = Math.min(Number(q.photoLimit) || 100, 500);
    setImmediate(() =>
      this.syncService.syncActors(actorLimit)
        .then(() => this.doSyncPhotos(photoLimit))
        .catch((err) => this.logger.error(`[syncAll background] Failed: ${err?.message}`)),
    );
    return ApiResponse.ok({ message: `Đang sync actors (${actorLimit} phim) + ảnh (${photoLimit} diễn viên) trong nền` });
  }

  @Delete('photos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Xóa toàn bộ ảnh + reset actor/director trong movie_sync' })
  async clearPhotos() {
    await this.photoRepo.clear();
    await this.movieRepo.query(`UPDATE movie_sync SET actor = NULL, director = NULL`);
    return ApiResponse.ok({ message: 'Đã xóa toàn bộ ảnh và dữ liệu diễn viên' });
  }

  @Get(':slug/movies/all')
  @ApiOperation({ summary: 'Tất cả phim của diễn viên (tối đa 500)' })
  @ApiParam({ name: 'slug', example: 'trieu-le-dinh' })
  async getMoviesAll(@Param('slug') slug: string) {
    try {
      const data = await this.ophim.getActorMovies(slug, { page: '1', limit: '500' });
      const items = data?.data?.items ?? data?.items ?? [];
      if (items.length > 0) return ApiResponse.ok(data);
    } catch { /* fall through */ }
    return this.moviesFromDb(slug, 1, 500);
  }

  @Get(':slug/movies')
  @ApiOperation({ summary: 'Phim của diễn viên có phân trang' })
  @ApiParam({ name: 'slug', example: 'trieu-le-dinh' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  async getMovies(@Param('slug') slug: string, @Query() q: Record<string, any>) {
    const page = Math.max(1, Number(q.page) || 1);
    const size = Math.min(Math.max(1, Number(q.size) || 20), 100);
    const params: Record<string, string> = { page: String(page), limit: String(size) };
    if (q.sort_field) params.sort_field = q.sort_field;
    if (q.sort_type)  params.sort_type  = q.sort_type;

    try {
      const data = await this.ophim.getActorMovies(slug, params);
      const items = data?.data?.items ?? data?.items ?? [];
      if (items.length > 0) {
        const p = data?.data?.params?.pagination ?? data?.params?.pagination;
        const pagination = p
          ? { currentPage: Number(p.currentPage), totalPages: Number(p.totalPages), totalItems: Number(p.totalItems), itemsPerPage: Number(p.totalItemsPerPage) }
          : undefined;
        return ApiResponse.ok(data, 'Success', pagination);
      }
    } catch { /* fall through */ }

    return this.moviesFromDb(slug, page, size);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * For each actor in our synced movies, find one of their movies in our DB,
   * call OPhim peoples endpoint, match by name, then store the TMDB photo.
   * Never calls /dien-vien/{slug} — only uses movies already synced to our DB.
   */
  private async doSyncPhotos(limit: number): Promise<void> {
    this.logger.log(`Starting actor photo sync (DB-only), limit=${limit}`);
    let found = 0;
    let failed = 0;

    // Get actors already having photos (skip them)
    const existing = await this.photoRepo.find({ select: ['actorSlug'] });
    const existingSlugs = new Set(existing.map((p) => p.actorSlug));

    // Get all unique actor names from our synced movies
    const rows: { name: string }[] = await this.movieRepo.query(`
      SELECT DISTINCT TRIM(actor_name) AS name
      FROM movie_sync,
           jsonb_array_elements_text(actor) AS actor_name
      WHERE actor IS NOT NULL
        AND actor_name IS NOT NULL
        AND TRIM(actor_name) != ''
      ORDER BY name ASC
    `);

    const toProcess: { name: string; slug: string }[] = [];
    for (const row of rows) {
      const slug = this.toSlug(row.name);
      if (slug && !existingSlugs.has(slug) && !toProcess.some((a) => a.slug === slug)) {
        toProcess.push({ name: row.name, slug });
        if (toProcess.length >= limit) break;
      }
    }

    this.logger.log(`Actor photo sync: ${toProcess.length} actors to process`);

    const BATCH = 3;
    for (let i = 0; i < toProcess.length; i += BATCH) {
      const batch = toProcess.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async ({ name, slug }) => {
          try {
            // Find synced movies that contain this actor (handles whitespace in stored names)
            const movieRows: { slug: string }[] = await this.movieRepo.query(
              `SELECT slug FROM movie_sync
               WHERE actor IS NOT NULL
               AND EXISTS (
                 SELECT 1 FROM jsonb_array_elements_text(actor) AS n
                 WHERE TRIM(n) = $1
               )
               LIMIT 3`,
              [name],
            );

            if (!movieRows.length) { failed++; return; }

            // Try peoples for each candidate movie until we get a match
            for (const movie of movieRows) {
              try {
                const raw = await this.ophim.get(`/phim/${movie.slug}/peoples`);
                // OPhim wraps response: { data: { peoples: [], profile_sizes: {} } }
                const peoplesData = raw?.data ?? raw;
                const peoples: any[] = peoplesData?.peoples ?? [];
                const profileSizes: Record<string, string> = peoplesData?.profile_sizes ?? {};

                const person = peoples.find((p: any) => {
                  return (
                    this.toSlug(p.name ?? '') === slug ||
                    this.toSlug(p.original_name ?? '') === slug
                  );
                });

                if (person?.profile_path) {
                  const base = profileSizes.w185 || 'https://image.tmdb.org/t/p/w185';
                  const photoUrl = `${base}${person.profile_path}`;
                  await this.photoRepo.upsert(
                    { actorSlug: slug, actorName: name, photoUrl },
                    ['actorSlug'],
                  );
                  found++;
                  return;
                }
              } catch {
                // try next movie
              }
            }
            failed++;
          } catch {
            failed++;
          }
        }),
      );
    }

    this.logger.log(`Actor photo sync done: found=${found}, failed=${failed}`);
  }

  /** Resolve actor display name from slug (checks actor_photos then scans DB) */
  private async actorNameFromSlug(slug: string): Promise<string | null> {
    const photo = await this.photoRepo.findOne({ where: { actorSlug: slug }, select: ['actorName'] });
    if (photo?.actorName) return photo.actorName;

    const rows: { name: string }[] = await this.movieRepo.query(`
      SELECT DISTINCT TRIM(actor_name) AS name
      FROM movie_sync, jsonb_array_elements_text(actor) AS actor_name
      WHERE actor IS NOT NULL AND TRIM(actor_name) != ''
    `);
    for (const row of rows) {
      if (this.toSlug(row.name) === slug) return row.name;
    }
    return null;
  }

  /** Query movies from DB by actor name, return response compatible with OPhim format */
  private async moviesFromDb(slug: string, page: number, size: number) {
    const actorName = await this.actorNameFromSlug(slug);

    if (!actorName) {
      return ApiResponse.ok(
        { items: [], titlePage: slug.replace(/-/g, ' ') },
        'Success',
        { currentPage: page, totalPages: 1, totalItems: 0, itemsPerPage: size },
      );
    }

    const countRows: { count: string }[] = await this.movieRepo.query(
      `SELECT COUNT(*) AS count FROM movie_sync
       WHERE actor IS NOT NULL
       AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(actor) AS n WHERE TRIM(n) = $1)`,
      [actorName],
    );
    const totalItems = parseInt(countRows[0]?.count ?? '0', 10);
    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const offset = (Math.min(page, totalPages) - 1) * size;

    const rows: any[] = await this.movieRepo.query(
      `SELECT slug, title, origin_name, type, thumb_url, poster_url,
              episode_current, quality, lang, year, category, ophim_id
       FROM movie_sync
       WHERE actor IS NOT NULL
       AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(actor) AS n WHERE TRIM(n) = $1)
       ORDER BY year DESC NULLS LAST, modified_at DESC NULLS LAST
       LIMIT $2 OFFSET $3`,
      [actorName, size, offset],
    );

    const items = rows.map((m) => ({
      _id: m.ophim_id ?? m.slug,
      name: m.title ?? '',
      slug: m.slug,
      origin_name: m.origin_name ?? '',
      type: m.type ?? '',
      thumb_url: m.thumb_url ?? '',
      poster_url: m.poster_url ?? '',
      episode_current: m.episode_current ?? '',
      quality: m.quality ?? '',
      lang: m.lang ?? '',
      year: m.year ?? 0,
      category: m.category ?? [],
    }));

    return ApiResponse.ok(
      { items, titlePage: actorName },
      'Success',
      { currentPage: page, totalPages, totalItems, itemsPerPage: size },
    );
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/đ/g, 'd')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
