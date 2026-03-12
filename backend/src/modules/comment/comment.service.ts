import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Post } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findByPost(postId: string): Promise<Comment[]> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.commentRepository.find({
      where: { postId },
      relations: ['user', 'likes'],
      order: { createdAt: 'ASC' },
    });
  }

  async create(userId: string, postId: string, dto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepository.create({ content: dto.content, userId, postId });
    return this.commentRepository.save(comment);
  }

  async update(commentId: string, userId: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Access denied');

    comment.content = dto.content;
    return this.commentRepository.save(comment);
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Access denied');

    await this.commentRepository.remove(comment);
  }

  async like(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.commentLikeRepository.findOne({ where: { userId, commentId } });
    if (existing) throw new ConflictException('Already liked');

    const like = this.commentLikeRepository.create({ userId, commentId });
    await this.commentLikeRepository.save(like);
  }

  async unlike(userId: string, commentId: string): Promise<void> {
    const like = await this.commentLikeRepository.findOne({ where: { userId, commentId } });
    if (!like) throw new NotFoundException('Like not found');
    await this.commentLikeRepository.remove(like);
  }
}
