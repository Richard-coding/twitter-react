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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findByPost(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Post()
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(userId, postId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.delete(id, userId);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  like(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.like(userId, id);
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlike(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.unlike(userId, id);
  }
}
