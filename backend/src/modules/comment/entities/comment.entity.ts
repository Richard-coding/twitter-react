import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { CommentLike } from './comment-like.entity';

@Entity('comments')
@Index(['postId'])
@Index(['userId'])
export class Comment extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];
}
