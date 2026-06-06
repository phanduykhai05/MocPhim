import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MovieViewCount } from '../../entities/movie-view-count.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(MovieViewCount) private repo: Repository<MovieViewCount>,
  ) {}

  private todayStr(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  async increment(slug: string): Promise<{ viewCount: number; viewCountToday: number }> {
    const today = this.todayStr();
    const rows: { viewCount: number; viewCountToday: number }[] = await this.repo.query(
      `INSERT INTO movie_view_count (slug, "viewCount", "viewCountToday", "lastResetDate", "updatedAt")
       VALUES ($1, 1, 1, $2, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         "viewCount"      = movie_view_count."viewCount" + 1,
         "viewCountToday" = CASE
           WHEN movie_view_count."lastResetDate" = $2 THEN movie_view_count."viewCountToday" + 1
           ELSE 1
         END,
         "lastResetDate"  = $2,
         "updatedAt"      = NOW()
       RETURNING "viewCount", "viewCountToday"`,
      [slug, today],
    );
    return { viewCount: rows[0]?.viewCount ?? 1, viewCountToday: rows[0]?.viewCountToday ?? 1 };
  }

  async getCount(slug: string): Promise<{ viewCount: number; viewCountToday: number }> {
    const record = await this.repo.findOne({ where: { slug } });
    return {
      viewCount: record?.viewCount ?? 0,
      viewCountToday: record?.viewCountToday ?? 0,
    };
  }

  async getBatch(slugs: string[]): Promise<Record<string, number>> {
    if (!slugs.length) return {};
    const records = await this.repo.find({ where: { slug: In(slugs) } });
    const map: Record<string, number> = {};
    for (const r of records) map[r.slug] = r.viewCount;
    return map;
  }

  async getTodayTotal(): Promise<number> {
    const today = this.todayStr();
    const result = await this.repo
      .createQueryBuilder('v')
      .select('SUM(v.viewCountToday)', 'total')
      .where('v.lastResetDate = :today', { today })
      .getRawOne();
    return Number(result?.total ?? 0);
  }

  async getTopViewed(limit = 10) {
    return this.repo.find({ order: { viewCount: 'DESC' }, take: limit });
  }
}
