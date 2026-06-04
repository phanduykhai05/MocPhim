import {
  Controller, Get, Post, Patch, Delete,
  Query, Param, Body, UseGuards,
  ParseIntPipe, DefaultValuePipe,
  NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, AuthProvider, User } from '../../entities/user.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

const SUPERADMIN_EMAIL = 'admin@mocphim.com';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @Get('users')
  @ApiOperation({ summary: '[Admin] Danh sách người dùng có phân trang và tìm kiếm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'enabled', required: false, description: 'true | false — lọc theo trạng thái' })
  async getUsers(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query('name') name?: string,
    @Query('enabled') enabledStr?: string,
  ) {
    const skip = Math.max(0, page) * size;
    const where: FindOptionsWhere<User> = {};
    if (name) where.name = Like(`%${name}%`);
    if (enabledStr === 'true')  where.enabled = true;
    if (enabledStr === 'false') where.enabled = false;

    const [rawUsers, total] = await this.userRepo.findAndCount({
      where,
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    // Strip sensitive fields, keep id always
    const users = rawUsers.map((u) => {
      const { password: _p, verifyToken: _vt, verifyExpires: _ve,
              resetToken: _rt, resetExpires: _re, providerId: _pi, ...safe } = u;
      return {
        ...safe,
        roles: Array.isArray(safe.roles)
          ? safe.roles
          : String(safe.roles).split(',').map((r) => r.trim()).filter(Boolean),
      };
    });

    const currentPage = page + 1;
    const totalPages = Math.ceil(total / size) || 1;

    return ApiResponse.ok(
      users,
      'Users fetched',
      { currentPage, totalPages, totalItems: total, itemsPerPage: size },
    );
  }

  @Post('users')
  @ApiOperation({ summary: '[Admin] Tạo tài khoản người dùng mới' })
  async createUser(
    @Body() body: { name: string; email: string; password: string; roles?: string[] },
  ) {
    const existing = await this.userRepo.findOne({ where: { email: body.email } });
    if (existing) throw new ConflictException('Email đã tồn tại trong hệ thống');

    const hashed = await bcrypt.hash(body.password, 10);
    const user = this.userRepo.create({
      name: body.name,
      email: body.email,
      password: hashed,
      roles: body.roles?.length ? body.roles : [Role.USER],
      isVerified: true,
      enabled: true,
      provider: AuthProvider.LOCAL,
    });
    await this.userRepo.save(user);
    const { password: _p, verifyToken: _vt, resetToken: _rt, ...safe } = user;
    return ApiResponse.ok(safe, 'Đã tạo tài khoản thành công');
  }

  @Patch('users/:id')
  @ApiOperation({ summary: '[Admin] Cập nhật thông tin người dùng' })
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; roles?: string[] },
  ) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.email === SUPERADMIN_EMAIL) throw new ForbiddenException('Không thể chỉnh sửa tài khoản superadmin');

    if (body.email && body.email !== user.email) {
      const dup = await this.userRepo.findOne({ where: { email: body.email } });
      if (dup) throw new ConflictException('Email đã tồn tại trong hệ thống');
    }

    if (body.name !== undefined) user.name = body.name;
    if (body.email !== undefined) user.email = body.email;
    if (body.roles !== undefined) user.roles = body.roles;

    await this.userRepo.save(user);
    const { password: _p, verifyToken: _vt, resetToken: _rt, ...safe } = user;
    return ApiResponse.ok(safe, 'Đã cập nhật thông tin');
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: '[Admin] Khoá / Mở khoá tài khoản' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() body: { enabled: boolean },
    @CurrentUser() me: User,
  ) {
    if (id === String(me.id)) throw new ForbiddenException('Không thể khoá chính tài khoản của bạn');

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.email === SUPERADMIN_EMAIL) throw new ForbiddenException('Không thể khoá tài khoản superadmin');

    user.enabled = body.enabled;
    await this.userRepo.save(user);
    return ApiResponse.ok(
      { id, enabled: body.enabled },
      body.enabled ? 'Đã mở khoá tài khoản' : 'Đã khoá tài khoản',
    );
  }

  @Delete('users/:id')
  @ApiOperation({ summary: '[Admin] Xoá tài khoản người dùng' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() me: User,
  ) {
    if (id === String(me.id)) throw new ForbiddenException('Không thể xoá chính tài khoản của bạn');

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.email === SUPERADMIN_EMAIL) throw new ForbiddenException('Không thể xoá tài khoản superadmin');

    if (user.roles.includes(Role.ADMIN)) {
      const adminCount = await this.userRepo.createQueryBuilder('u')
        .where("u.roles LIKE :r", { r: '%ROLE_ADMIN%' })
        .andWhere('u.id != :id', { id })
        .getCount();
      if (adminCount === 0) throw new ForbiddenException('Không thể xoá admin cuối cùng của hệ thống');
    }

    await this.userRepo.remove(user);
    return ApiResponse.ok(null, 'Đã xoá tài khoản');
  }

  @Get('roles/stats')
  @ApiOperation({ summary: '[Admin] Số lượng người dùng theo vai trò' })
  async getRoleStats() {
    const [total, adminCount, editorCount] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.createQueryBuilder('u').where("u.roles LIKE :r", { r: '%ROLE_ADMIN%' }).getCount(),
      this.userRepo.createQueryBuilder('u').where("u.roles LIKE :r", { r: '%ROLE_EDITOR%' }).getCount(),
    ]);
    return ApiResponse.ok({
      admin:  adminCount,
      editor: editorCount,
      user:   total - adminCount - editorCount,
      total,
    });
  }
}
