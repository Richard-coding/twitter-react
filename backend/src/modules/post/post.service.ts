import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async create(userId: string, dto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({ content: dto.content, userId });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'likes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { userId },
      relations: ['user', 'likes'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(postId: string, userId: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Access denied');
    post.content = dto.content;
    return this.postRepository.save(post);
  }

  async delete(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Access denied');
    await this.postRepository.remove(post);
  }

  async like(userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeRepository.findOne({ where: { userId, postId } });
    if (existing) throw new ConflictException('Already liked');

    const like = this.likeRepository.create({ userId, postId });
    await this.likeRepository.save(like);
  }

  async unlike(userId: string, postId: string): Promise<void> {
    const like = await this.likeRepository.findOne({ where: { userId, postId } });
    if (!like) throw new NotFoundException('Like not found');
    await this.likeRepository.remove(like);
  }
}
