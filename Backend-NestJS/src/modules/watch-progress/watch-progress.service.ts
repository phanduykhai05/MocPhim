import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchProgress } from '../../entities/watch-progress.entity';
import { UpdateProgressDto } from './dto/progress.dto';

@Injectable()
export class WatchProgressService {
  constructor(
    @InjectRepository(WatchProgress) private repo: Repository<WatchProgress>,
  ) {}

  async getProgress(userId: string, movieId: string, episodeNumber: number) {
    return this.repo.findOne({ where: { userId, movieId, episodeNumber } });
  }

  async getAllForMovie(userId: string, movieId: string) {
    return this.repo.find({
      where: { userId, movieId },
      order: { episodeNumber: 'ASC' },
    });
  }

  async getResumePoint(userId: string, slug: string) {
    return this.repo.findOne({
      where: { userId, slug },
      order: { lastWatchedAt: 'DESC' },
    });
  }

  async updateProgress(
    userId: string,
    movieId: string,
    episodeNumber: number,
    dto: UpdateProgressDto,
    requesterId: string,
  ) {
    if (userId !== requesterId) throw new ForbiddenException('Access denied');

    let progress = await this.repo.findOne({ where: { userId, movieId, episodeNumber } });

    if (!progress) {
      progress = this.repo.create({
        userId,
        movieId,
        episodeNumber,
        slug: dto.slug ?? movieId,
      });
    }

    if (dto.positionSeconds !== undefined) progress.positionSeconds = dto.positionSeconds;
    if (dto.isCompleted !== undefined) progress.isCompleted = dto.isCompleted;
    if (dto.slug) progress.slug = dto.slug;

    return this.repo.save(progress);
  }
}
