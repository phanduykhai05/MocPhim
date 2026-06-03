import {
  Controller, Get, Query, UseGuards, ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, User } from '../../entities/user.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @Get('users')
  @ApiOperation({ summary: '[Admin] Danh sách người dùng có phân trang và tìm kiếm' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang (0-based)', example: 0 })
  @ApiQuery({ name: 'size', required: false, description: 'Số user mỗi trang', example: 20 })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm theo tên' })
  async getUsers(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query('name') name?: string,
  ) {
    // Frontend sends 0-based page index
    const skip = Math.max(0, page) * size;

    const where = name ? { name: Like(`%${name}%`) } : {};

    const [rawUsers, total] = await this.userRepo.findAndCount({
      select: {
        id: true, email: true, name: true, roles: true,
        isVerified: true, enabled: true, provider: true,
        avatar: true, createdAt: true, updatedAt: true,
      },
      where,
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    // simple-array may come back as string when using select — normalize to array
    const users = rawUsers.map((u) => ({
      ...u,
      roles: Array.isArray(u.roles)
        ? u.roles
        : String(u.roles).split(',').map((r) => r.trim()).filter(Boolean),
    }));

    const currentPage = page + 1;
    const totalPages = Math.ceil(total / size) || 1;

    return ApiResponse.ok(
      users,
      'Users fetched',
      { currentPage, totalPages, totalItems: total, itemsPerPage: size },
    );
  }
}
