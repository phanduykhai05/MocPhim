import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LoginLog } from '../../entities/login-log.entity';
import { SecurityConfig } from '../../entities/security-config.entity';
import { BackupRecord } from '../../entities/backup-record.entity';
import { SecurityController, PublicSecurityController } from './security.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginLog, SecurityConfig, BackupRecord])],
  controllers: [SecurityController, PublicSecurityController],
  providers: [BackupService],
  exports: [TypeOrmModule],
})
export class SecurityModule {}
