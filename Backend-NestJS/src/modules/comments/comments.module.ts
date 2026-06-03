import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../../entities/comment.entity';
import { CommentVote } from '../../entities/comment-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentVote])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
