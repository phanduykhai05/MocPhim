import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OphimService } from '../ophim/ophim.service';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Years')
@Controller('api/v1/years')
export class YearsController {
  constructor(private ophim: OphimService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách năm phát hành' })
  async getAll() {
    return ApiResponse.ok(await this.ophim.get('/nam-phat-hanh'));
  }

  @Get(':year/movies/all')
  @ApiOperation({ summary: 'Lấy tất cả phim theo năm (tối đa 500)' })
  @ApiParam({ name: 'year', example: '2024' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMoviesAll(@Param('year') year: string, @Query() q: Record<string, any>) {
    const { sort_field, sort_type } = q;
    const params: Record<string, string> = { page: '1', limit: '500' };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    return ApiResponse.ok(await this.ophim.getYearMovies(year, params));
  }

  @Get(':year/movies')
  @ApiOperation({ summary: 'Phim theo năm có phân trang' })
  @ApiParam({ name: 'year', example: '2024' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMovies(@Param('year') year: string, @Query() q: Record<string, any>) {
    const { page = 1, size = 20, sort_field, sort_type } = q;
    const params: Record<string, string> = { page: String(page), limit: String(size) };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    const data = await this.ophim.getYearMovies(year, params);
    const p = data?.data?.params?.pagination ?? data?.params?.pagination;
    const pagination = p ? { currentPage: Number(p.currentPage), totalPages: Number(p.totalPages), totalItems: Number(p.totalItems), itemsPerPage: Number(p.totalItemsPerPage) } : undefined;
    return ApiResponse.ok(data, 'Success', pagination);
  }
}
