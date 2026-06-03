import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OphimService } from '../ophim/ophim.service';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Countries')
@Controller('api/v1/countries')
export class CountriesController {
  constructor(private ophim: OphimService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả quốc gia' })
  async getAll() {
    return ApiResponse.ok(await this.ophim.get('/quoc-gia'));
  }

  @Get(':slug/movies/all')
  @ApiOperation({ summary: 'Lấy tất cả phim theo quốc gia (tối đa 500)' })
  @ApiParam({ name: 'slug', example: 'au-my' })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMoviesAll(@Param('slug') slug: string, @Query() q: Record<string, any>) {
    const { sort_field, sort_type } = q;
    const params: Record<string, string> = { page: '1', limit: '500' };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    return ApiResponse.ok(await this.ophim.getCountryMovies(slug, params));
  }

  @Get(':slug/movies')
  @ApiOperation({ summary: 'Phim theo quốc gia có phân trang' })
  @ApiParam({ name: 'slug', example: 'au-my' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({ name: 'sort_field', required: false })
  @ApiQuery({ name: 'sort_type', required: false })
  async getMovies(@Param('slug') slug: string, @Query() q: Record<string, any>) {
    const { page = 1, size = 20, sort_field, sort_type } = q;
    const params: Record<string, string> = { page: String(page), limit: String(size) };
    if (sort_field) params.sort_field = sort_field;
    if (sort_type)  params.sort_type  = sort_type;
    return ApiResponse.ok(await this.ophim.getCountryMovies(slug, params));
  }
}
