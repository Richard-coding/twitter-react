import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existing = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (existing) throw new ConflictException('Already following this user');

    const follow = this.followRepository.create({ followerId, followingId });
    await this.followRepository.save(follow);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (!follow) throw new NotFoundException('Not following this user');
    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    return this.followRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return this.followRepository.find({
      where: { followerId: userId },
      relations: ['following'],
    });
  }
}
