import {
  Controller, Get, Patch, Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody,
} from '@nestjs/swagger';
import { WatchProgressService } from './watch-progress.service';
import { UpdateProgressDto } from './dto/progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Watch Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/progress')
export class WatchProgressController {
  constructor(private service: WatchProgressService) {}

  @Get(':userId/resume/:slug')
  @ApiOperation({ summary: 'Lấy điểm tiếp tục xem mới nhất của phim' })
  @ApiParam({ name: 'userId' }) @ApiParam({ name: 'slug', example: 'one-piece' })
  async getResumePoint(@Param('userId') userId: string, @Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.getResumePoint(userId, slug));
  }

  @Get(':userId/:movieId/:episodeNumber')
  @ApiOperation({ summary: 'Lấy tiến độ xem một tập cụ thể' })
  @ApiParam({ name: 'userId' }) @ApiParam({ name: 'movieId' }) @ApiParam({ name: 'episodeNumber', example: 1 })
  async getProgress(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
    @Param('episodeNumber', ParseIntPipe) ep: number,
  ) {
    return ApiResponse.ok(await this.service.getProgress(userId, movieId, ep));
  }

  @Get(':userId/:movieId')
  @ApiOperation({ summary: 'Lấy toàn bộ tiến độ xem của một phim' })
  @ApiParam({ name: 'userId' }) @ApiParam({ name: 'movieId' })
  async getAllForMovie(@Param('userId') userId: string, @Param('movieId') movieId: string) {
    return ApiResponse.ok(await this.service.getAllForMovie(userId, movieId));
  }

  @Patch(':userId/:movieId/:episodeNumber')
  @ApiOperation({ summary: 'Cập nhật tiến độ xem tập phim' })
  @ApiParam({ name: 'userId' }) @ApiParam({ name: 'movieId' }) @ApiParam({ name: 'episodeNumber', example: 1 })
  @ApiBody({ type: UpdateProgressDto })
  async updateProgress(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
    @Param('episodeNumber', ParseIntPipe) ep: number,
    @Body() dto: UpdateProgressDto,
    @CurrentUser() me: any,
  ) {
    return ApiResponse.ok(await this.service.updateProgress(userId, movieId, ep, dto, me.id));
  }
}
