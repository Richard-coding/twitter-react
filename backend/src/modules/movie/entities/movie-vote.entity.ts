import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { MovieSuggestion } from './movie-suggestion.entity';

@Entity('movie_votes')
@Unique(['userId', 'movieId'])
@Index(['movieId'])
export class MovieVote extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'movie_id' })
  movieId: string;

  @ManyToOne(() => MovieSuggestion, (movie) => movie.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieSuggestion;
}
