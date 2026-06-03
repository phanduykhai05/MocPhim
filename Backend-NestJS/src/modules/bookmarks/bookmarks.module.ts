import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from '../../entities/bookmark.entity';
import { WatchProgress } from '../../entities/watch-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, WatchProgress])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
