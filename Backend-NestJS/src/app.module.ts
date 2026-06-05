import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { User } from './entities/user.entity';
import { MovieSync } from './entities/movie-sync.entity';
import { Bookmark } from './entities/bookmark.entity';
import { WatchProgress } from './entities/watch-progress.entity';
import { SearchHistory } from './entities/search-history.entity';
import { Comment } from './entities/comment.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { MovieViewCount } from './entities/movie-view-count.entity';
import { SeoConfig } from './entities/seo-config.entity';
import { LoginLog } from './entities/login-log.entity';
import { SecurityConfig } from './entities/security-config.entity';
import { BackupRecord } from './entities/backup-record.entity';

import { OphimModule } from './modules/ophim/ophim.module';
import { SeoModule } from './modules/seo/seo.module';
import { SecurityModule } from './modules/security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SearchModule } from './modules/search/search.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CountriesModule } from './modules/countries/countries.module';
import { YearsModule } from './modules/years/years.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { WatchProgressModule } from './modules/watch-progress/watch-progress.module';
import { SyncModule } from './modules/sync/sync.module';
import { AdminModule } from './modules/admin/admin.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ViewsModule } from './modules/views/views.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        entities: [User, MovieSync, Bookmark, WatchProgress, SearchHistory, Comment, CommentVote, MovieViewCount, SeoConfig, LoginLog, SecurityConfig, BackupRecord],
        synchronize: true,
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    ScheduleModule.forRoot(),
    OphimModule,
    AuthModule,
    MoviesModule,
    SearchModule,
    CategoriesModule,
    CountriesModule,
    YearsModule,
    BookmarksModule,
    WatchProgressModule,
    SyncModule,
    AdminModule,
    SeoModule,
    SecurityModule,
    CommentsModule,
    ViewsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
