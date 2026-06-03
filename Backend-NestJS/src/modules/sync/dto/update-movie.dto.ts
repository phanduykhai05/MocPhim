import { IsOptional, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() originName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() quality?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lang?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1900) @Max(2100) year?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() episodeCurrent?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() duration?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() posterUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() subDocquyen?: boolean;
}
