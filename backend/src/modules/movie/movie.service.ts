import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MovieSuggestion } from './entities/movie-suggestion.entity';
import { MovieVote } from './entities/movie-vote.entity';
import { MovieRating } from './entities/movie-rating.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieSuggestion)
    private readonly movieRepository: Repository<MovieSuggestion>,
    @InjectRepository(MovieVote)
    private readonly voteRepository: Repository<MovieVote>,
    @InjectRepository(MovieRating)
    private readonly ratingRepository: Repository<MovieRating>,
  ) {}

  async findAll(): Promise<MovieSuggestion[]> {
    return this.movieRepository.find({
      where: { watchedAt: IsNull() },
      relations: ['suggestedBy', 'votes', 'ratings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWatched(): Promise<MovieSuggestion[]> {
    return this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.suggestedBy', 'suggestedBy')
      .leftJoinAndSelect('movie.votes', 'votes')
      .leftJoinAndSelect('movie.ratings', 'ratings')
      .leftJoinAndSelect('ratings.user', 'ratingUser')
      .where('movie.watched_at IS NOT NULL')
      .orderBy('movie.watched_at', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<MovieSuggestion> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['suggestedBy', 'votes', 'votes.user', 'ratings', 'ratings.user'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create(userId: string, dto: CreateMovieDto): Promise<MovieSuggestion> {
    const movie = this.movieRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      posterUrl: dto.posterUrl ?? null,
      year: dto.year ?? null,
      genre: dto.genre ?? null,
      suggestedById: userId,
    });
    return this.movieRepository.save(movie);
  }

  async update(movieId: string, userId: string, dto: UpdateMovieDto): Promise<MovieSuggestion> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');
    if (movie.suggestedById !== userId) throw new ForbiddenException('Access denied');

    if (dto.title !== undefined) movie.title = dto.title;
    if (dto.description !== undefined) movie.description = dto.description;
    if (dto.posterUrl !== undefined) movie.posterUrl = dto.posterUrl;
    if (dto.year !== undefined) movie.year = dto.year;
    if (dto.genre !== undefined) movie.genre = dto.genre;

    return this.movieRepository.save(movie);
  }

  async delete(movieId: string, userId: string): Promise<void> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');
    if (movie.suggestedById !== userId) throw new ForbiddenException('Access denied');
    await this.movieRepository.remove(movie);
  }

  async vote(userId: string, movieId: string): Promise<void> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');

    const existing = await this.voteRepository.findOne({ where: { userId, movieId } });
    if (existing) throw new ConflictException('Already voted');

    const vote = this.voteRepository.create({ userId, movieId });
    await this.voteRepository.save(vote);
  }

  async unvote(userId: string, movieId: string): Promise<void> {
    const vote = await this.voteRepository.findOne({ where: { userId, movieId } });
    if (!vote) throw new NotFoundException('Vote not found');
    await this.voteRepository.remove(vote);
  }

  async markWatched(movieId: string, userId: string): Promise<MovieSuggestion> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');

    movie.watchedAt = new Date();
    movie.markedWatchedById = userId;
    return this.movieRepository.save(movie);
  }

  async createRating(movieId: string, userId: string, dto: CreateRatingDto): Promise<MovieRating> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');
    if (!movie.watchedAt) throw new BadRequestException('Movie has not been watched yet');

    const existing = await this.ratingRepository.findOne({ where: { userId, movieId } });
    if (existing) throw new ConflictException('Already rated this movie');

    const rating = this.ratingRepository.create({
      userId,
      movieId,
      score: dto.score,
      comment: dto.comment ?? null,
    });
    return this.ratingRepository.save(rating);
  }

  async updateRating(ratingId: string, userId: string, dto: UpdateRatingDto): Promise<MovieRating> {
    const rating = await this.ratingRepository.findOne({ where: { id: ratingId } });
    if (!rating) throw new NotFoundException('Rating not found');
    if (rating.userId !== userId) throw new ForbiddenException('Access denied');

    if (dto.score !== undefined) rating.score = dto.score;
    if (dto.comment !== undefined) rating.comment = dto.comment;

    return this.ratingRepository.save(rating);
  }

  async deleteRating(ratingId: string, userId: string): Promise<void> {
    const rating = await this.ratingRepository.findOne({ where: { id: ratingId } });
    if (!rating) throw new NotFoundException('Rating not found');
    if (rating.userId !== userId) throw new ForbiddenException('Access denied');
    await this.ratingRepository.remove(rating);
  }
}
