import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('seo_config')
export class SeoConfig {
  @PrimaryColumn({ type: 'varchar', default: 'global' })
  id: string;

  @Column({ type: 'jsonb', default: '{}' })
  settings: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt: Date;
}
