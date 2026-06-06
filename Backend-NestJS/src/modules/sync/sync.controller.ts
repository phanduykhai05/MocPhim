import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse,
} from '@nestjs/swagger';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';
import { ApiResponse as ApiRes } from '../../common/dto/api-response.dto';

@ApiTags('Sync')
@Controller('api/v1/sync')
export class SyncController {
  constructor(private service: SyncService) {}

  @Get('movies/all')
  @ApiOperation({ summary: 'Lấy tối đa 500 phim đã sync (không phân trang)' })
  @ApiResponse({ status: 200, description: 'Mảng tối đa 500 phim' })
  async getSyncedAll() {
    const data = await this.service.getSyncedAll();
    return ApiRes.ok(data);
  }

  @Get('movies/count')
  @ApiOperation({ summary: 'Tổng số phim đã sync trong DB' })
  @ApiResponse({ status: 200, description: 'Số nguyên — tổng số phim' })
  async getCount() {
    const data = await this.service.getSyncedCount();
    return ApiRes.ok(data);
  }

  @Get('movies')
  @ApiOperation({ summary: 'Lấy danh sách phim đã sync (phân trang 0-based)' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang (0-based)', example: 0 })
  @ApiQuery({ name: 'size', required: false, description: 'Số phim mỗi trang', example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách phim + tổng' })
  async getSynced(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
  ) {
    const data = await this.service.getSynced(page, size);
    const safeSize = Math.max(1, size);
    const totalPages = Math.max(1, Math.ceil(data.total / safeSize));
    return ApiRes.ok(data, 'Success', { currentPage: page + 1, totalPages, totalItems: data.total, itemsPerPage: safeSize });
  }

  @Patch('movies/:slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Chỉnh sửa thông tin phim trong DB' })
  @ApiParam({ name: 'slug', description: 'Slug của phim', example: 'one-piece' })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({ status: 200, description: 'Phim sau khi cập nhật' })
  async updateMovie(
    @Param('slug') slug: string,
    @Body() dto: UpdateMovieDto,
  ) {
    const data = await this.service.updateMovie(slug, dto);
    return ApiRes.ok(data, 'Cập nhật thành công');
  }

  @Post('movies/trigger')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Kích hoạt sync phim từ OPhim' })
  @ApiQuery({ name: 'startPage', required: false, description: 'Trang bắt đầu', example: 1 })
  @ApiQuery({ name: 'maxPages', required: false, description: 'Số trang tối đa', example: 50 })
  @ApiResponse({ status: 201, description: '{ added, skipped }' })
  async triggerSync(
    @Query('startPage', new DefaultValuePipe(1), ParseIntPipe) startPage: number,
    @Query('maxPages', new DefaultValuePipe(50), ParseIntPipe) maxPages: number,
  ) {
    const data = await this.service.syncMovies(startPage, maxPages);
    return ApiRes.ok(data, 'Sync completed');
  }

  @Post('movies/resync')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Resync phim thiếu ophimId (đồng bộ)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số phim xử lý', example: 100 })
  @ApiResponse({ status: 201, description: '{ updated, notFound }' })
  async resync(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    const data = await this.service.resync(limit);
    return ApiRes.ok(data, 'Resync completed');
  }

  @Post('movies/sync-actors')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Lấy actor/director cho phim chưa có (bất đồng bộ nền)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số phim xử lý', example: 200 })
  @ApiResponse({ status: 201, description: '{ message: string }' })
  async syncActors(
    @Query('limit', new DefaultValuePipe(200), ParseIntPipe) limit: number,
  ) {
    setImmediate(() => this.service.syncActors(limit).catch((err) => {
      console.error('[syncActors background] Failed:', err?.message);
    }));
    return ApiRes.ok({ message: `Đang sync actors cho ${limit} phim trong nền...` });
  }

  @Post('movies/resync-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Resync toàn bộ phim thiếu ophimId (bất đồng bộ nền)' })
  @ApiResponse({ status: 201, description: '{ message: string }' })
  async resyncAll() {
    const data = await this.service.resyncAll();
    return ApiRes.ok(data, data.message);
  }
}
