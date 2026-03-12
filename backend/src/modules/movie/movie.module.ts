import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieSuggestion } from './entities/movie-suggestion.entity';
import { MovieVote } from './entities/movie-vote.entity';
import { MovieRating } from './entities/movie-rating.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovieSuggestion, MovieVote, MovieRating]), AuthModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
