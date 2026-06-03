import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';

@Module({ controllers: [CountriesController] })
export class CountriesModule {}
