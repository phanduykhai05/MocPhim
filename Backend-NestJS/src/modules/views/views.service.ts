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
    let record = await this.repo.findOne({ where: { slug } });
    if (!record) {
      record = this.repo.create({ slug, viewCount: 0, viewCountToday: 0 });
    }

    const today = this.todayStr();
    if (record.lastResetDate !== today) {
      record.viewCountToday = 0;
      record.lastResetDate = today;
    }

    record.viewCount++;
    record.viewCountToday++;
    await this.repo.save(record);
    return { viewCount: record.viewCount, viewCountToday: record.viewCountToday };
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
