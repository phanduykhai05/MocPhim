import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoConfig } from '../../entities/seo-config.entity';
import { SeoController, PublicSeoController } from './seo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeoConfig])],
  controllers: [SeoController, PublicSeoController],
  exports: [TypeOrmModule],
})
export class SeoModule {}
