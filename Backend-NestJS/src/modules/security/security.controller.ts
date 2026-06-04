import {
  Controller, Get, Put, Post, Delete, Body, Query, Param,
  UseGuards, ParseIntPipe, DefaultValuePipe,
  StreamableFile, Res, NotFoundException, InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';
import { LoginLog } from '../../entities/login-log.entity';
import { SecurityConfig } from '../../entities/security-config.entity';
import { BackupRecord } from '../../entities/backup-record.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BackupService } from './backup.service';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const CONFIG_ID = 'global';

const DEFAULT_SECURITY: Record<string, unknown> = {
  enable2FA: false,
  detectAnomaly: true,
  backupSchedule: 'daily',
  backupRetention: '30',
  enableClientProtection: true,
  blockDevToolsKeyShortcuts: true,
  blockContextMenu: true,
  blockViewSourceShortcut: true,
  blockCopySelection: false,
  blockPrintShortcut: false,
  blockSaveShortcut: false,
  blurWhenTabHidden: false,
  frameBustProtection: true,
};

// Brute-force threshold: >5 failures in 15 minutes
const BRUTE_THRESHOLD = 5;
const BRUTE_WINDOW_MS = 15 * 60 * 1000;

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/v1/admin/security')
export class SecurityController {
  constructor(
    @InjectRepository(LoginLog) private logRepo: Repository<LoginLog>,
    @InjectRepository(SecurityConfig) private configRepo: Repository<SecurityConfig>,
    @InjectRepository(BackupRecord) private backupRepo: Repository<BackupRecord>,
    private backupService: BackupService,
  ) {}

  // ── Settings ──────────────────────────────────────────────────────────────

  @Get('settings')
  @ApiOperation({ summary: '[Admin] Lấy cấu hình bảo mật' })
  async getSettings() {
    let config = await this.configRepo.findOne({ where: { id: CONFIG_ID } });
    if (!config) {
      config = this.configRepo.create({ id: CONFIG_ID, settings: DEFAULT_SECURITY });
      await this.configRepo.save(config);
    }
    return ApiResponse.ok({ settings: { ...DEFAULT_SECURITY, ...config.settings }, updatedAt: config.updatedAt });
  }

  @Put('settings')
  @ApiOperation({ summary: '[Admin] Lưu cấu hình bảo mật' })
  async saveSettings(@Body() body: Record<string, unknown>) {
    let config = await this.configRepo.findOne({ where: { id: CONFIG_ID } });
    if (!config) config = this.configRepo.create({ id: CONFIG_ID, settings: { ...DEFAULT_SECURITY } });
    config.settings = { ...DEFAULT_SECURITY, ...config.settings, ...body };
    await this.configRepo.save(config);
    return ApiResponse.ok({ settings: config.settings }, 'Đã lưu cấu hình bảo mật');
  }

  // ── Login logs ────────────────────────────────────────────────────────────

  @Get('login-logs')
  @ApiOperation({ summary: '[Admin] Lịch sử đăng nhập có phân trang' })
  async getLoginLogs(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query('email') email?: string,
    @Query('status') status?: string,
    @Query('ip') ip?: string,
  ) {
    const qb = this.logRepo.createQueryBuilder('log').orderBy('log.createdAt', 'DESC');
    if (email) qb.andWhere('log.email ILIKE :email', { email: `%${email}%` });
    if (status) qb.andWhere('log.status = :status', { status });
    if (ip) qb.andWhere('log.ip ILIKE :ip', { ip: `%${ip}%` });
    qb.skip(page * size).take(size);
    const [items, total] = await qb.getManyAndCount();
    const currentPage = page + 1;
    const totalPages = Math.ceil(total / size) || 1;
    return ApiResponse.ok(items, 'OK', { currentPage, totalPages, totalItems: total, itemsPerPage: size });
  }

  // ── Stats card ────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: '[Admin] Thống kê bảo mật' })
  async getStats() {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [total24h, failed24h, success24h] = await Promise.all([
      this.logRepo.count({ where: { createdAt: MoreThan(since24h) } }),
      this.logRepo.count({ where: { status: 'failed', createdAt: MoreThan(since24h) } }),
      this.logRepo.count({ where: { status: 'success', createdAt: MoreThan(since24h) } }),
    ]);
    return ApiResponse.ok({ total24h, failed24h, success24h });
  }

  // ── Anomaly alerts ────────────────────────────────────────────────────────

  @Get('alerts')
  @ApiOperation({ summary: '[Admin] Các bất thường được phát hiện' })
  async getAlerts() {
    const since = new Date(Date.now() - BRUTE_WINDOW_MS);

    // Brute-force by email: >BRUTE_THRESHOLD failures in window
    const emailBrute = await this.logRepo
      .createQueryBuilder('log')
      .select('log.email', 'email')
      .addSelect('COUNT(*)', 'count')
      .where('log.status = :s', { s: 'failed' })
      .andWhere('log.createdAt > :since', { since })
      .groupBy('log.email')
      .having('COUNT(*) > :n', { n: BRUTE_THRESHOLD })
      .getRawMany<{ email: string; count: string }>();

    // Brute-force by IP
    const ipBrute = await this.logRepo
      .createQueryBuilder('log')
      .select('log.ip', 'ip')
      .addSelect('COUNT(*)', 'count')
      .where('log.status = :s', { s: 'failed' })
      .andWhere('log.createdAt > :since', { since })
      .groupBy('log.ip')
      .having('COUNT(*) > :n', { n: BRUTE_THRESHOLD })
      .getRawMany<{ ip: string; count: string }>();

    const alerts: Array<{
      id: string; type: string; severity: string; target: string; detail: string; detectedAt: Date;
    }> = [];

    emailBrute.forEach((row) => {
      alerts.push({
        id: `bf-email-${row.email}`,
        type: 'bruteforce',
        severity: parseInt(row.count) > 20 ? 'high' : 'medium',
        target: row.email,
        detail: `${row.count} lần thất bại trong 15 phút`,
        detectedAt: new Date(),
      });
    });

    ipBrute.forEach((row) => {
      alerts.push({
        id: `bf-ip-${row.ip}`,
        type: 'bruteforce_ip',
        severity: parseInt(row.count) > 20 ? 'high' : 'medium',
        target: row.ip,
        detail: `${row.count} lần thất bại từ cùng IP`,
        detectedAt: new Date(),
      });
    });

    return ApiResponse.ok(alerts);
  }

  // ── Backup: list records ──────────────────────────────────────────────────

  @Get('backups')
  @ApiOperation({ summary: '[Admin] Danh sách bản backup' })
  async getBackups(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    ensureBackupDir();
    const [items, total] = await this.backupRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: page * size,
      take: size,
    });

    // Annotate each record with whether the file actually exists on disk
    const enriched = items.map((item) => ({
      ...item,
      fileExists: fs.existsSync(path.join(BACKUP_DIR, item.filename)),
    }));

    return ApiResponse.ok(enriched, 'OK', {
      currentPage: page + 1, totalPages: Math.ceil(total / size) || 1,
      totalItems: total, itemsPerPage: size,
    });
  }

  // ── Backup: browse directory ──────────────────────────────────────────────

  @Get('backup-dir')
  @ApiOperation({ summary: '[Admin] Duyệt thư mục backup (hỗ trợ subdir qua query ?sub=)' })
  async browseBackupDir(@Query('sub') sub?: string) {
    ensureBackupDir();

    const rootResolved = path.resolve(BACKUP_DIR).toLowerCase();
    const targetDir    = sub ? path.resolve(BACKUP_DIR, sub) : path.resolve(BACKUP_DIR);

    // Prevent path traversal
    if (!targetDir.toLowerCase().startsWith(rootResolved)) {
      throw new BadRequestException('Đường dẫn không hợp lệ');
    }
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      throw new NotFoundException('Thư mục không tồn tại');
    }

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    const files = entries.map((e) => {
      const fullPath = path.join(targetDir, e.name);
      let size = 0;
      let sizeLabel = '—';
      try {
        if (e.isFile()) {
          size = fs.statSync(fullPath).size;
          sizeLabel = formatBytes(size);
        }
      } catch { /* ignore */ }
      return {
        name: e.name,
        isDirectory: e.isDirectory(),
        size,
        sizeLabel,
        relativePath: path.relative(BACKUP_DIR, fullPath),
      };
    }).sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return ApiResponse.ok({
      dir: targetDir,
      rootDir: BACKUP_DIR,
      relativePath: path.relative(BACKUP_DIR, targetDir) || '.',
      files,
    });
  }

  @Get('backup-file')
  @ApiOperation({ summary: '[Admin] Đọc nội dung file trong thư mục backup' })
  async readBackupFile(
    @Query('rel') rel: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(200), ParseIntPipe) limit: number,
  ) {
    if (!rel) throw new BadRequestException('Thiếu tham số rel');

    const filePath = path.resolve(BACKUP_DIR, rel);
    if (!filePath.startsWith(path.resolve(BACKUP_DIR))) {
      throw new BadRequestException('Đường dẫn không hợp lệ');
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      throw new NotFoundException('File không tồn tại');
    }

    const stat = fs.statSync(filePath);
    const MAX_READ = 5 * 1024 * 1024; // 5 MB tối đa
    if (stat.size > MAX_READ && offset === 0) {
      // Đọc từng phần theo dòng
    }

    const allLines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const totalLines = allLines.length;
    const safeLimit = Math.min(limit, 500);
    const chunk = allLines.slice(offset, offset + safeLimit);

    return ApiResponse.ok({
      filename: path.basename(filePath),
      totalLines,
      offset,
      limit: safeLimit,
      hasMore: offset + safeLimit < totalLines,
      content: chunk.join('\n'),
      sizeLabel: formatBytes(stat.size),
    });
  }

  // ── Backup: trigger ───────────────────────────────────────────────────────

  @Post('backups/trigger')
  @ApiOperation({ summary: '[Admin] Kích hoạt backup thủ công (pg_dump)' })
  async triggerBackup(@CurrentUser() user: any) {
    ensureBackupDir();
    const now = new Date();
    const tag = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${tag}-manual.sql`;

    const record = this.backupRepo.create({
      filename,
      type: 'manual',
      status: 'running',
      triggeredBy: user?.email ?? 'admin',
    });
    await this.backupRepo.save(record);

    const outPath = path.join(BACKUP_DIR, filename);

    // Export database via TypeORM — không cần pg_dump
    (async () => {
      try {
        await this.backupService.exportToSql(outPath);
        const size = fs.statSync(outPath).size;
        record.status = 'done';
        record.sizeLabel = formatBytes(size);
      } catch (err) {
        record.status = 'failed';
        record.errorMessage = String(err);
      }
      await this.backupRepo.save(record);
    })();

    return ApiResponse.ok({ id: record.id, filename, status: 'running' }, 'Đã kích hoạt backup');
  }

  // ── Backup: download ──────────────────────────────────────────────────────

  @Get('backups/:id/download')
  @ApiOperation({ summary: '[Admin] Tải xuống file backup' })
  async downloadBackup(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const record = await this.backupRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Không tìm thấy bản backup');

    const filePath = path.join(BACKUP_DIR, record.filename);
    if (!fs.existsSync(filePath)) throw new NotFoundException('File backup không tồn tại trên disk');

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${record.filename}"`,
    });
    return new StreamableFile(fs.createReadStream(filePath));
  }

  // ── Backup: delete ────────────────────────────────────────────────────────

  @Delete('backups/:id')
  @ApiOperation({ summary: '[Admin] Xoá bản backup (record + file)' })
  async deleteBackup(@Param('id') id: string) {
    const record = await this.backupRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Không tìm thấy bản backup');

    const filePath = path.join(BACKUP_DIR, record.filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      throw new InternalServerErrorException(`Không thể xoá file: ${String(err)}`);
    }

    await this.backupRepo.remove(record);
    return ApiResponse.ok(null, 'Đã xoá bản backup');
  }
}

// ── Public controller (no auth) ───────────────────────────────────────────────
// Exposes only client-side protection flags so SecurityGuard can fetch from backend

const CLIENT_KEYS: (keyof typeof DEFAULT_SECURITY)[] = [
  'enableClientProtection', 'blockDevToolsKeyShortcuts', 'blockContextMenu',
  'blockViewSourceShortcut', 'blockCopySelection', 'blockPrintShortcut',
  'blockSaveShortcut', 'blurWhenTabHidden', 'frameBustProtection',
];

@ApiTags('Security')
@Controller('api/v1/security')
export class PublicSecurityController {
  constructor(
    @InjectRepository(SecurityConfig) private configRepo: Repository<SecurityConfig>,
  ) {}

  @Get('client-settings')
  @ApiOperation({ summary: '[Public] Cấu hình bảo vệ frontend (không cần auth)' })
  async getClientSettings() {
    const config = await this.configRepo.findOne({ where: { id: CONFIG_ID } });
    const merged = { ...DEFAULT_SECURITY, ...(config?.settings ?? {}) };
    const clientSettings = Object.fromEntries(
      CLIENT_KEYS.map((k) => [k, merged[k]]),
    );
    return ApiResponse.ok(clientSettings);
  }
}
