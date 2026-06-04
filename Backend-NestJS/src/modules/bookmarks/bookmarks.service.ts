import {
  Injectable, ConflictException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { WatchProgress } from '../../entities/watch-progress.entity';
import { OphimService } from '../ophim/ophim.service';
import { AddBookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private bookmarkRepo: Repository<Bookmark>,
    @InjectRepository(WatchProgress) private progressRepo: Repository<WatchProgress>,
    private ophim: OphimService,
  ) {}

  async getBookmarks(userId: string) {
    const bookmarks = await this.bookmarkRepo.find({
      where: { userId },
      order: { bookmarkDate: 'DESC' },
    });

    const enriched = await Promise.all(
      bookmarks.map(async (bm) => {
        const progress = await this.progressRepo.findOne({
          where: { userId, movieId: bm.movieId },
          order: { lastWatchedAt: 'DESC' },
        });
        return {
          ...bm,
          // Flat fields matching frontend BookmarkItem interface
          latestEpisode: progress?.episodeNumber ?? null,
          positionSeconds: progress?.positionSeconds ?? null,
          episodeCompleted: progress?.isCompleted ?? null,
          lastWatchedAt: progress?.lastWatchedAt ?? null,
        };
      }),
    );

    return enriched;
  }

  async backfillFromProgress(userId: string): Promise<{ added: number }> {
    const progresses = await this.progressRepo.find({ where: { userId } });
    let added = 0;
    for (const p of progresses) {
      const exists = await this.bookmarkRepo.findOne({ where: { userId, movieId: p.movieId } });
      if (exists) continue;
      try {
        const res = await this.ophim.getMovieDetail(p.slug);
        const item = res?.data?.item ?? res?.movie ?? res?.item;
        if (!item) continue;
        await this.bookmarkRepo.save(this.bookmarkRepo.create({
          userId,
          movieId: p.movieId,
          slug: p.slug,
          movieTitle: item.name ?? item.title ?? p.slug,
          posterUrl: item.poster_url ?? item.thumb_url,
          thumbUrl: item.thumb_url ?? item.poster_url,
          mediaType: item.type,
        }));
        added++;
      } catch { continue; }
    }
    return { added };
  }

  async isBookmarked(userId: string, movieId: string): Promise<boolean> {
    const bm = await this.bookmarkRepo.findOne({ where: { userId, movieId } });
    return !!bm;
  }

  async addBookmark(userId: string, dto: AddBookmarkDto) {
    // Lookup movie from OPhim to get _id and metadata
    const res = await this.ophim.getMovieDetail(dto.slug);
    const item = res?.data?.item ?? res?.movie ?? res?.item;
    if (!item) throw new NotFoundException('Movie not found on OPhim');

    const movieId: string = item._id ?? item.id ?? dto.slug;

    const existing = await this.bookmarkRepo.findOne({ where: { userId, movieId } });
    if (existing) throw new ConflictException('Already bookmarked');

    const bm = this.bookmarkRepo.create({
      userId,
      movieId,
      slug: dto.slug,
      movieTitle: item.name ?? item.title,
      posterUrl: item.poster_url ?? item.thumb_url,
      thumbUrl: item.thumb_url ?? item.poster_url,
      mediaType: item.type,
    });
    return this.bookmarkRepo.save(bm);
  }

  async removeBookmark(userId: string, movieId: string, requesterId: string) {
    if (userId !== requesterId) throw new ForbiddenException('Access denied');
    const bm = await this.bookmarkRepo.findOne({ where: { userId, movieId } });
    if (!bm) throw new NotFoundException('Bookmark not found');
    await this.bookmarkRepo.remove(bm);
    return { message: 'Bookmark removed' };
  }
}
