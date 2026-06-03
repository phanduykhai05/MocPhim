import {
  Controller, Post, Get, Body, Query, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery, ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiResponse as ApiRes } from '../../common/dto/api-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Gửi email xác minh' })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return ApiRes.ok(data, data.message);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập bằng email/password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: '{ accessToken, refreshToken, expiresIn, userId, email, roles }' })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return ApiRes.ok(data, 'Login successful');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token bằng refresh token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Token mới' })
  async refresh(@Body('refreshToken') token: string) {
    const data = await this.authService.refresh(token);
    return ApiRes.ok(data, 'Token refreshed');
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đăng xuất (xóa token phía client)' })
  @ApiResponse({ status: 201, description: 'Đăng xuất thành công' })
  logout() {
    return ApiRes.ok(null, 'Logged out successfully');
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Xác minh email qua token trong link' })
  @ApiQuery({ name: 'token', required: true, description: 'Token xác minh từ email' })
  @ApiResponse({ status: 200, description: 'Email đã được xác minh' })
  async verifyEmail(@Query('token') token: string) {
    const data = await this.authService.verifyEmail(token);
    return ApiRes.ok(data, data.message);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi email đặt lại mật khẩu' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 201, description: 'Email đặt lại mật khẩu đã được gửi' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(dto.email);
    return ApiRes.ok(null, data.message);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng token từ email' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Mật khẩu đã được đặt lại' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this.authService.resetPassword(dto.token, dto.newPassword);
    return ApiRes.ok(null, data.message);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin user (không có password)' })
  async getMe(@CurrentUser() user: any) {
    const data = await this.authService.getMe(user.id);
    return ApiRes.ok(data);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Đăng nhập bằng Google OAuth2' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback từ Google OAuth2' })
  async googleCallback(@Req() req: any) {
    const data = await this.authService.googleLogin(req.user);
    return ApiRes.ok(data, 'Google login successful');
  }
}
