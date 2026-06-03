import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Unique,
} from 'typeorm';

@Entity('comment_votes')
@Unique(['commentId', 'userId'])
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commentId: number;

  @Column()
  userId: string;

  @Column()
  voteType: 'up' | 'down';

  @CreateDateColumn()
  createdAt: Date;
}
