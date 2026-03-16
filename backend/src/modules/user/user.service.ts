import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Post } from '../post/entities/post.entity';
import { Follow } from '../follow/entities/follow.entity';

export interface PublicProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getProfile(username: string, currentUserId: string): Promise<PublicProfile> {
    const user = await this.userRepository.findOne({ where: { username: username.toLocaleLowerCase() } });
    if (!user) throw new NotFoundException('User not found');

    const [postsCount, followersCount, followingCount, followRecord] = await Promise.all([
      this.postRepository.count({ where: { userId: user.id } }),
      this.followRepository.count({ where: { followingId: user.id } }),
      this.followRepository.count({ where: { followerId: user.id } }),
      this.followRepository.findOne({
        where: { followerId: currentUserId, followingId: user.id },
      }),
    ]);

    const { password, ...safeUser } = user as any;

    return {
      ...safeUser,
      stats: { postsCount, followersCount, followingCount },
      isFollowing: !!followRecord,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }
}
