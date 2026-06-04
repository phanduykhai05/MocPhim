import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index, Unique,
} from 'typeorm';

@Entity('bookmarks')
@Unique(['userId', 'movieId'])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Column()
  movieId: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  movieTitle: string;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  thumbUrl: string;

  @Column({ nullable: true })
  mediaType: string;

  @CreateDateColumn()
  bookmarkDate: Date;
}
