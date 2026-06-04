import {
  Controller, Get, Post, Delete, Param, Body, UseGuards, ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiResponse,
} from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { AddBookmarkDto } from './dto/bookmark.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiResponse as ApiRes } from '../../common/dto/api-response.dto';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/bookmarks')
export class BookmarksController {
  constructor(private service: BookmarksService) {}

  @Post('backfill/:userId')
  @ApiOperation({ summary: 'Tạo bookmark từ lịch sử xem (backfill)' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  async backfill(@Param('userId') userId: string, @CurrentUser() me: any) {
    if (userId !== String(me.id)) throw new ForbiddenException('Access denied');
    const data = await this.service.backfillFromProgress(userId);
    return ApiRes.ok(data, `Đã thêm ${data.added} bookmark từ lịch sử xem`);
  }

  @Get('isBookmarked/:userId/:movieId')
  @ApiOperation({ summary: 'Kiểm tra phim đã được bookmark chưa' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  @ApiParam({ name: 'movieId', description: 'OPhim _id của phim', example: '6a2032706997f14383cf424e' })
  @ApiResponse({ status: 200, description: 'data: true/false' })
  async isBookmarked(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    const data = await this.service.isBookmarked(userId, movieId);
    return ApiRes.ok(data);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Lấy danh sách bookmark kèm tiến độ xem mới nhất' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  async getBookmarks(@Param('userId') userId: string, @CurrentUser() me: any) {
    if (userId !== String(me.id)) throw new ForbiddenException('Access denied');
    const data = await this.service.getBookmarks(userId);
    return ApiRes.ok(data);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm phim vào bookmark (chỉ cần slug)' })
  @ApiBody({ type: AddBookmarkDto })
  @ApiResponse({ status: 201, description: 'Bookmark đã được tạo với movieId lấy từ OPhim' })
  async addBookmark(@Body() dto: AddBookmarkDto, @CurrentUser() me: any) {
    const data = await this.service.addBookmark(String(me.id), dto);
    return ApiRes.ok(data, 'Bookmark added');
  }

  @Delete(':userId/:movieId')
  @ApiOperation({ summary: 'Xóa bookmark' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  @ApiParam({ name: 'movieId', description: 'OPhim _id của phim' })
  async removeBookmark(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
    @CurrentUser() me: any,
  ) {
    const data = await this.service.removeBookmark(userId, movieId, String(me.id));
    return ApiRes.ok(data, data.message);
  }
}
