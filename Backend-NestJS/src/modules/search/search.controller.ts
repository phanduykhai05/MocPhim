import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OphimService } from '../ophim/ophim.service';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Search')
@Controller('api/v1/search')
export class SearchController {
  constructor(
    private ophim: OphimService,
    private searchService: SearchService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Tìm kiếm tất cả (tối đa 500 kết quả)' })
  @ApiQuery({ name: 'keyword', required: true, example: 'conan' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async searchAll(@Query() q: Record<string, any>) {
    const { keyword = '', sort_field, sort_type } = q;
    const params: Record<string, string> = { keyword, page: '1', limit: '500' };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    const data = await this.ophim.search(keyword, params);
    if (keyword) await this.searchService.recordSearch(keyword);
    return ApiResponse.ok(data);
  }

  @Get()
  @ApiOperation({ summary: 'Tìm kiếm phim có phân trang' })
  @ApiQuery({ name: 'keyword', required: true, example: 'conan' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async search(@Query() q: Record<string, any>) {
    const { keyword = '', page = 1, size = 20, sort_field, sort_type } = q;
    const params: Record<string, string> = { keyword, page: String(page), limit: String(size) };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    const data = await this.ophim.search(keyword, params);
    if (keyword) await this.searchService.recordSearch(keyword);
    return ApiResponse.ok(data);
  }

  @Get('history')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Top từ khóa tìm kiếm nhiều nhất' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async history(@Query('limit') limit = 20) {
    const data = await this.searchService.getTopSearches(+limit);
    return ApiResponse.ok(data);
  }
}
