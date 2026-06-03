import {
  Entity, PrimaryGeneratedColumn, Column,
  UpdateDateColumn, Index, Unique,
} from 'typeorm';

@Entity('watch_progress')
@Unique(['userId', 'movieId', 'episodeNumber'])
export class WatchProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Column()
  movieId: string;

  @Column()
  slug: string;

  @Column()
  episodeNumber: number;

  @Column({ default: 0 })
  positionSeconds: number;

  @Column({ default: false })
  isCompleted: boolean;

  @UpdateDateColumn()
  lastWatchedAt: Date;
}
