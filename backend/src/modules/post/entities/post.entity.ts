import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Like } from './like.entity';
import { PostReaction } from './post-reaction.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 280 })
  content: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  mediaUrls: string[];

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => PostReaction, (reaction) => reaction.post)
  reactions: PostReaction[];
}
