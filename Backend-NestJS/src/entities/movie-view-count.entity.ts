import {
  Entity, PrimaryGeneratedColumn, Column,
  UpdateDateColumn, Index,
} from 'typeorm';

@Entity('movie_view_count')
export class MovieViewCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  viewCountToday: number;

  @Column({ type: 'varchar', nullable: true })
  lastResetDate: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
