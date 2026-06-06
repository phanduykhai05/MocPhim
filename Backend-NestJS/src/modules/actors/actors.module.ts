import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsController } from './actors.controller';
import { MovieSync } from '../../entities/movie-sync.entity';
import { ActorPhoto } from '../../entities/actor-photo.entity';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovieSync, ActorPhoto]), SyncModule],
  controllers: [ActorsController],
})
export class ActorsModule {}
