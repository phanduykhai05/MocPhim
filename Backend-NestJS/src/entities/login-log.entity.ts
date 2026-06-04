import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type LoginStatus = 'success' | 'failed';

@Entity('login_logs')
@Index(['email', 'createdAt'])
@Index(['ip', 'createdAt'])
export class LoginLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  userId: string | null;

  @Column()
  ip: string;

  @Column({ nullable: true, type: 'varchar' })
  userAgent: string | null;

  @Column({ type: 'varchar', default: 'success' })
  status: LoginStatus;

  @Column({ nullable: true, type: 'varchar' })
  failReason: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
