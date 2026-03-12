import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { MovieVote } from './movie-vote.entity';
import { MovieRating } from './movie-rating.entity';

@Entity('movie_suggestions')
@Index(['suggestedById'])
export class MovieSuggestion extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

  @Column({ name: 'poster_url', type: 'varchar', length: 500, nullable: true })
  posterUrl: string | null;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre: string | null;

  @Column({ name: 'suggested_by_id' })
  suggestedById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'suggested_by_id' })
  suggestedBy: User;

  @Column({ name: 'watched_at', type: 'timestamp', nullable: true })
  watchedAt: Date | null;

  @Column({ name: 'marked_watched_by_id', nullable: true })
  markedWatchedById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'marked_watched_by_id' })
  markedWatchedBy: User | null;

  @OneToMany(() => MovieVote, (vote) => vote.movie)
  votes: MovieVote[];

  @OneToMany(() => MovieRating, (rating) => rating.movie)
  ratings: MovieRating[];
}
