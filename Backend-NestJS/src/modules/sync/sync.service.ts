import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovieSync } from '../../entities/movie-sync.entity';
import { OphimService } from '../ophim/ophim.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(MovieSync) private repo: Repository<MovieSync>,
    private ophim: OphimService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async scheduledSync() {
    this.logger.log('Running scheduled movie sync...');
    const result = await this.syncMovies(1, 50);
    this.logger.log(`Sync done: added=${result.added}, skipped=${result.skipped}`);
  }

  async syncMovies(startPage = 1, maxPages = 50): Promise<{ added: number; skipped: number }> {
    let added = 0;
    let skipped = 0;

    for (let page = startPage; page < startPage + maxPages; page++) {
      try {
        const res = await this.ophim.getMovieList('phim-moi', { page: String(page), limit: '24' });
        const items: any[] = res?.data?.items ?? res?.items ?? [];
        if (!items.length) break;

        for (const item of items) {
          const slug = item.slug;
          if (!slug) continue;
          const existing = await this.repo.findOne({ where: { slug } });
          if (existing) { skipped++; continue; }

          await this.repo.save(this.repo.create({
            slug,
            ophimId: item._id ?? item.id,
            title: item.name ?? item.title,
            originName: item.origin_name,
            type: item.type,
            thumbUrl: item.thumb_url,
            posterUrl: item.poster_url,
            year: item.year,
            category: item.category,
            country: item.country,
            episodeCurrent: item.episode_current,
            quality: item.quality,
            lang: item.lang,
            modifiedAt: item.modified?.time,
          }));
          added++;
        }
      } catch (err: any) {
        this.logger.error(`Sync error page ${page}: ${err.message}`);
        break;
      }
    }

    return { added, skipped };
  }

  async resync(limit = 100): Promise<{ updated: number; notFound: number }> {
    const missing = await this.repo.find({
      where: { ophimId: IsNull() },
      take: limit,
    });

    let updated = 0;
    let notFound = 0;

    for (const movie of missing) {
      try {
        const res = await this.ophim.getMovieDetail(movie.slug);
        const item = res?.data?.item ?? res?.movie;
        if (!item) { notFound++; continue; }

        movie.ophimId        = item._id ?? item.id;
        movie.originName     = item.origin_name;
        movie.type           = item.type;
        movie.thumbUrl       = item.thumb_url;
        movie.posterUrl      = item.poster_url;
        movie.episodeCurrent = item.episode_current;
        movie.quality        = item.quality;
        movie.lang           = item.lang;
        movie.year           = item.year;
        movie.category       = item.category;
        movie.country        = item.country;
        await this.repo.save(movie);
        updated++;
      } catch {
        notFound++;
      }
    }

    return { updated, notFound };
  }

  async resyncAll(): Promise<{ message: string }> {
    setImmediate(() => this.resync(10000).catch(() => {}));
    return { message: 'Resync started in background' };
  }

  async getSynced(page = 0, size = 20) {
    // page is 0-based from frontend
    const skip = Math.max(0, page) * size;
    const [items, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: size,
    });
    return { items, total, page, size };
  }

  async updateMovie(slug: string, dto: any) {
    const movie = await this.repo.findOne({ where: { slug } });
    if (!movie) throw new Error('Movie not found');
    Object.assign(movie, dto);
    return this.repo.save(movie);
  }

  async getSyncedAll() {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: 500 });
  }

  async getSyncedCount(): Promise<number> {
    return this.repo.count();
  }
}
