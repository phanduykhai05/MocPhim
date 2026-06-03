import {
  Controller, Get, Post, Delete, Patch, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam,
  ApiQuery, ApiBody, ApiResponse,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentStatusDto, VoteCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiResponse as ApiRes } from '../../common/dto/api-response.dto';

@ApiTags('Comments')
@Controller('api/v1/comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy danh sách bình luận theo phim' })
  @ApiParam({ name: 'slug', description: 'Slug của phim', example: 'one-piece' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang (0-based)', example: 0 })
  @ApiQuery({ name: 'size', required: false, description: 'Số bình luận mỗi trang', example: 10 })
  @ApiQuery({ name: 'userId', required: false, description: 'userId để biết user đã vote chưa' })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận kèm replies và userVote' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('userId') userId?: string,
  ) {
    const data = await this.service.getBySlug(slug, page, size, userId);
    return ApiRes.ok(data);
  }

  @Post(':slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đăng bình luận mới' })
  @ApiParam({ name: 'slug', description: 'Slug của phim', example: 'one-piece' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Bình luận đã được đăng' })
  async create(
    @Param('slug') slug: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.service.create(slug, dto, user);
    return ApiRes.ok(data, 'Bình luận đã được đăng');
  }

  @Post(':id/vote')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Vote bình luận (click lại để undo)' })
  @ApiParam({ name: 'id', description: 'ID của bình luận', example: 1 })
  @ApiBody({ type: VoteCommentDto })
  @ApiResponse({ status: 200, description: 'Kết quả vote cập nhật' })
  async vote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VoteCommentDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.service.vote(id, dto, user.id);
    return ApiRes.ok(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa bình luận (chủ sở hữu hoặc admin)' })
  @ApiParam({ name: 'id', description: 'ID của bình luận', example: 1 })
  @ApiResponse({ status: 200, description: 'Đã xóa bình luận' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    const isAdmin = user.roles?.includes(Role.ADMIN);
    const data = await this.service.delete(id, user.id, isAdmin);
    return ApiRes.ok(data);
  }

  // ─── Admin ────────────────────────────────────────────────────────────────────

  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Lấy toàn bộ bình luận có phân trang' })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false, enum: ['approved', 'pending', 'spam'] })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận cho admin' })
  async getAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query('status') status?: string,
  ) {
    const data = await this.service.getAll(page, size, status);
    return ApiRes.ok(
      data.data,
      'OK',
      { currentPage: page + 1, totalPages: Math.ceil(data.total / size) || 1, totalItems: data.total, itemsPerPage: size },
    );
  }

  @Patch('admin/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái bình luận' })
  @ApiParam({ name: 'id', description: 'ID bình luận', example: 1 })
  @ApiBody({ type: UpdateCommentStatusDto })
  @ApiResponse({ status: 200, description: 'Trạng thái đã được cập nhật' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentStatusDto,
  ) {
    const data = await this.service.updateStatus(id, dto);
    return ApiRes.ok(data);
  }
}
