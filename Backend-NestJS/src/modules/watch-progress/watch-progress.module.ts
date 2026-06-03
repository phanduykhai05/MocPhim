import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchProgressController } from './watch-progress.controller';
import { WatchProgressService } from './watch-progress.service';
import { WatchProgress } from '../../entities/watch-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WatchProgress])],
  controllers: [WatchProgressController],
  providers: [WatchProgressService],
})
export class WatchProgressModule {}
