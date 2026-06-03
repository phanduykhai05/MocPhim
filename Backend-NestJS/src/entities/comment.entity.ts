import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export type CommentStatus = 'pending' | 'approved' | 'spam';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  movieSlug: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  userAvatar: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isSpoiler: boolean;

  @Column({ nullable: true, type: 'int' })
  parentId: number;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: CommentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
