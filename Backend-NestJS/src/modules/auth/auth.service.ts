import {
  BadRequestException, Injectable, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthProvider, Role } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });

    if (existing) {
      if (!existing.isVerified) {
        existing.verifyToken = uuidv4();
        existing.verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.userRepo.save(existing);
        return { message: 'Verification email resent. Please check your inbox.' };
      }
      throw new BadRequestException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      provider: AuthProvider.LOCAL,
      roles: [Role.USER],
      verifyToken: uuidv4(),
      verifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await this.userRepo.save(user);

    return { message: 'Registration successful. Please verify your email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('Email not verified');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async verifyEmail(token: string) {
    const user = await this.userRepo.findOne({ where: { verifyToken: token } });
    if (!user) throw new BadRequestException('Invalid verification token');
    if (!user.verifyExpires || user.verifyExpires < new Date()) throw new BadRequestException('Verification token expired');

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyExpires = null;
    await this.userRepo.save(user);
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent.' };

    user.resetToken = uuidv4();
    user.resetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepo.save(user);

    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { resetToken: token } });
    if (!user) throw new BadRequestException('Invalid reset token');
    if (!user.resetExpires || user.resetExpires < new Date()) throw new BadRequestException('Reset token expired');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetExpires = null;
    await this.userRepo.save(user);

    return { message: 'Password reset successfully' };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async googleLogin(googleUser: any) {
    let user = await this.userRepo.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.userRepo.create({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        provider: AuthProvider.GOOGLE,
        providerId: googleUser.providerId,
        roles: [Role.USER],
        isVerified: true,
      });
      await this.userRepo.save(user);
    }

    return this.generateTokens(user);
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { password, verifyToken, resetToken, ...safe } = user;
    return safe;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '30m'),
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d') },
    );
    // expiresIn in milliseconds to match frontend AuthContext expectation
    const expiresIn = 30 * 60 * 1000;
    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
