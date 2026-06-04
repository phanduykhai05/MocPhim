import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('security_config')
export class SecurityConfig {
  @PrimaryColumn({ type: 'varchar', default: 'global' })
  id: string;

  @Column({ type: 'jsonb', default: '{}' })
  settings: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt: Date;
}
