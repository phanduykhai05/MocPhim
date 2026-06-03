import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { CommentVote } from '../../entities/comment-vote.entity';
import { CreateCommentDto, UpdateCommentStatusDto, VoteCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(CommentVote) private voteRepo: Repository<CommentVote>,
  ) {}

  async getBySlug(slug: string, page = 0, size = 10, userId?: string) {
    const [comments, total] = await this.commentRepo.findAndCount({
      where: { movieSlug: slug, status: 'approved', parentId: null as any },
      order: { createdAt: 'DESC' },
      skip: page * size,
      take: size,
    });

    const enriched = await Promise.all(
      comments.map(async (c) => {
        const replies = await this.commentRepo.find({
          where: { parentId: c.id, status: 'approved' },
          order: { createdAt: 'ASC' },
          take: 5,
        });
        const userVote = userId
          ? await this.voteRepo.findOne({ where: { commentId: c.id, userId } })
          : null;
        return { ...c, replies, userVote: userVote?.voteType ?? null };
      }),
    );

    return { comments: enriched, total, page, size };
  }

  async create(slug: string, dto: CreateCommentDto, user: any) {
    const comment = this.commentRepo.create({
      movieSlug: slug,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: dto.content,
      isSpoiler: dto.isSpoiler ?? false,
      parentId: dto.parentId ?? undefined,
      status: 'approved',
    });
    return this.commentRepo.save(comment);
  }

  async vote(commentId: number, dto: VoteCommentDto, userId: string) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.voteRepo.findOne({ where: { commentId, userId } });

    if (existing) {
      if (existing.voteType === dto.voteType) {
        // Undo vote
        if (dto.voteType === 'up') comment.upvotes = Math.max(0, comment.upvotes - 1);
        else comment.downvotes = Math.max(0, comment.downvotes - 1);
        await this.voteRepo.remove(existing);
        await this.commentRepo.save(comment);
        return { ...comment, userVote: null };
      }
      // Switch vote
      if (existing.voteType === 'up') { comment.upvotes = Math.max(0, comment.upvotes - 1); comment.downvotes++; }
      else { comment.downvotes = Math.max(0, comment.downvotes - 1); comment.upvotes++; }
      existing.voteType = dto.voteType;
      await this.voteRepo.save(existing);
    } else {
      await this.voteRepo.save(this.voteRepo.create({ commentId, userId, voteType: dto.voteType }));
      if (dto.voteType === 'up') comment.upvotes++;
      else comment.downvotes++;
    }

    await this.commentRepo.save(comment);
    return { ...comment, userVote: dto.voteType };
  }

  async delete(commentId: number, userId: string, isAdmin: boolean) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (!isAdmin && comment.userId !== userId) throw new ForbiddenException('Access denied');
    await this.commentRepo.remove(comment);
    return { message: 'Deleted' };
  }

  // Admin
  async getAll(page = 0, size = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await this.commentRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: page * size,
      take: size,
    });
    return { data, total, page, size };
  }

  async updateStatus(commentId: number, dto: UpdateCommentStatusDto) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    comment.status = dto.status;
    return this.commentRepo.save(comment);
  }
}
