import { Entity, Column, ManyToOne, JoinColumn, Unique, Index, Check } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { MovieSuggestion } from './movie-suggestion.entity';

@Entity('movie_ratings')
@Unique(['userId', 'movieId'])
@Index(['movieId'])
@Check('"score" >= 1 AND "score" <= 5')
export class MovieRating extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'movie_id' })
  movieId: string;

  @ManyToOne(() => MovieSuggestion, (movie) => movie.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieSuggestion;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string | null;
}
