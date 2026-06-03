import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';

@Module({ controllers: [MoviesController] })
export class MoviesModule {}
