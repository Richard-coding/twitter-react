import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, PostReaction]), AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
