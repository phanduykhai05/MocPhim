import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OphimService } from '../ophim/ophim.service';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private ophim: OphimService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả thể loại phim' })
  async getAll() {
    return ApiResponse.ok(await this.ophim.get('/the-loai'));
  }

  @Get(':slug/movies/all')
  @ApiOperation({ summary: 'Lấy tất cả phim theo thể loại (tối đa 500)' })
  @ApiParam({ name: 'slug', example: 'hanh-dong' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMoviesAll(@Param('slug') slug: string, @Query() q: Record<string, any>) {
    const { sort_field, sort_type } = q;
    const params: Record<string, string> = { page: '1', limit: '500' };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    return ApiResponse.ok(await this.ophim.getCategoryMovies(slug, params));
  }

  @Get(':slug/movies')
  @ApiOperation({ summary: 'Phim theo thể loại có phân trang' })
  @ApiParam({ name: 'slug', example: 'hanh-dong' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMovies(@Param('slug') slug: string, @Query() q: Record<string, any>) {
    const { page = 1, size = 20, sort_field, sort_type } = q;
    const params: Record<string, string> = { page: String(page), limit: String(size) };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    const data = await this.ophim.getCategoryMovies(slug, params);
    const p = data?.data?.params?.pagination ?? data?.params?.pagination;
    const pagination = p ? { currentPage: Number(p.currentPage), totalPages: Number(p.totalPages), totalItems: Number(p.totalItems), itemsPerPage: Number(p.totalItemsPerPage) } : undefined;
    return ApiResponse.ok(data, 'Success', pagination);
  }
}
