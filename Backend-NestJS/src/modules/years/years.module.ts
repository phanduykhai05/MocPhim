import { Module } from '@nestjs/common';
import { YearsController } from './years.controller';

@Module({ controllers: [YearsController] })
export class YearsModule {}
