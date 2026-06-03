import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('movie_sync')
export class MovieSync {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  ophimId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  originName: string;

  @Column({ type: 'text', nullable: true })
  alternativeNames: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  thumbUrl: string;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  subDocquyen: boolean;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  episodeCurrent: string;

  @Column({ nullable: true })
  quality: string;

  @Column({ nullable: true })
  lang: string;

  @Column({ nullable: true, type: 'int' })
  year: number;

  @Column({ type: 'jsonb', nullable: true })
  category: any;

  @Column({ type: 'jsonb', nullable: true })
  country: any;

  @Column({ type: 'jsonb', nullable: true })
  tmdb: any;

  @Column({ type: 'jsonb', nullable: true })
  imdb: any;

  @Column({ nullable: true })
  modifiedAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
