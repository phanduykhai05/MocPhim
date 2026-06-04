import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type BackupStatus = 'done' | 'running' | 'failed';
export type BackupType = 'manual' | 'scheduled';

@Entity('backup_records')
export class BackupRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({ type: 'varchar', default: 'manual' })
  type: BackupType;

  @Column({ type: 'varchar', default: 'running' })
  status: BackupStatus;

  @Column({ nullable: true, type: 'varchar' })
  sizeLabel: string | null;

  @Column({ nullable: true, type: 'text' })
  errorMessage: string | null;

  @Column({ nullable: true, type: 'varchar' })
  triggeredBy: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
