import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { MovieViewCount } from '../../entities/movie-view-count.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieViewCount])],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
