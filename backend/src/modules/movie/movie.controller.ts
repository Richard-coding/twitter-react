import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get('watched')
  findWatched() {
    return this.movieService.findWatched();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movieService.findOne(id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMovieDto,
  ) {
    return this.movieService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.movieService.delete(id, userId);
  }

  @Post(':id/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  vote(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.movieService.vote(userId, id);
  }

  @Delete(':id/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  unvote(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.movieService.unvote(userId, id);
  }

  @Patch(':id/watch')
  markWatched(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.movieService.markWatched(id, userId);
  }

  @Post(':id/ratings')
  createRating(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.movieService.createRating(id, userId, dto);
  }

  @Patch(':id/ratings/:ratingId')
  updateRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.movieService.updateRating(ratingId, userId, dto);
  }

  @Delete(':id/ratings/:ratingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.movieService.deleteRating(ratingId, userId);
  }
}
