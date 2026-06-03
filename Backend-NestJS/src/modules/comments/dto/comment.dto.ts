import { IsString, MaxLength, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSpoiler?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateCommentStatusDto {
  @ApiProperty({ enum: ['approved', 'pending', 'spam'] })
  @IsIn(['approved', 'pending', 'spam'])
  status: 'approved' | 'pending' | 'spam';
}

export class VoteCommentDto {
  @ApiProperty({ enum: ['up', 'down'] })
  @IsIn(['up', 'down'])
  voteType: 'up' | 'down';
}
