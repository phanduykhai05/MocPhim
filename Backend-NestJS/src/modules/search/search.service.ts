import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from '../../entities/search-history.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchHistory) private repo: Repository<SearchHistory>,
  ) {}

  async recordSearch(keyword: string) {
    const existing = await this.repo.findOne({ where: { keyword } });
    if (existing) {
      existing.searchCount++;
      await this.repo.save(existing);
    } else {
      await this.repo.save(this.repo.create({ keyword, searchCount: 1 }));
    }
  }

  async getTopSearches(limit = 20) {
    return this.repo.find({
      order: { searchCount: 'DESC' },
      take: limit,
    });
  }
}
