import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MovieSync } from '../../entities/movie-sync.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieSync])],
  controllers: [MoviesController],
})
export class MoviesModule {}
