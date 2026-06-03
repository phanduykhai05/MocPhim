import {
  Controller, Get, Post, Param, Query,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse,
} from '@nestjs/swagger';
import { ViewsService } from './views.service';
import { ApiResponse as ApiRes } from '../../common/dto/api-response.dto';

@ApiTags('Views')
@Controller('api/v1/views')
export class ViewsController {
  constructor(private service: ViewsService) {}

  @Get('stats/today')
  @ApiOperation({ summary: 'Lấy tổng lượt xem trong ngày hôm nay' })
  @ApiResponse({ status: 200, description: '{ total: number }' })
  async todayTotal() {
    const total = await this.service.getTodayTotal();
    return ApiRes.ok({ total });
  }

  @Get('top')
  @ApiOperation({ summary: 'Top phim có nhiều lượt xem nhất' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng', example: 10 })
  @ApiResponse({ status: 200, description: 'Danh sách phim xếp hạng lượt xem' })
  async getTopViewed(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const data = await this.service.getTopViewed(limit);
    return ApiRes.ok(data);
  }

  @Get('batch')
  @ApiOperation({ summary: 'Lấy lượt xem nhiều phim cùng lúc (batch)' })
  @ApiQuery({ name: 'slugs', required: true, description: 'Danh sách slug cách nhau bằng dấu phẩy', example: 'one-piece,vincenzo,xung-luc' })
  @ApiResponse({ status: 200, description: 'Map { slug: viewCount }' })
  async getBatch(@Query('slugs') slugsParam: string) {
    const slugs = (slugsParam ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const data = await this.service.getBatch(slugs);
    return ApiRes.ok(data);
  }

  @Post(':slug')
  @ApiOperation({ summary: 'Tăng lượt xem cho phim' })
  @ApiParam({ name: 'slug', description: 'Slug của phim', example: 'one-piece' })
  @ApiResponse({ status: 201, description: '{ viewCount, viewCountToday }' })
  async increment(@Param('slug') slug: string) {
    const data = await this.service.increment(slug);
    return ApiRes.ok(data);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy lượt xem của một phim' })
  @ApiParam({ name: 'slug', description: 'Slug của phim', example: 'one-piece' })
  @ApiResponse({ status: 200, description: '{ viewCount, viewCountToday }' })
  async getCount(@Param('slug') slug: string) {
    const data = await this.service.getCount(slug);
    return ApiRes.ok(data);
  }
}
