import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBookmarkDto {
  @ApiProperty()
  @IsString()
  slug: string;
}
