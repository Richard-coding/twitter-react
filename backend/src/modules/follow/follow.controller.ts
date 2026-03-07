import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  follow(
    @CurrentUser('id') followerId: string,
    @Param('id', ParseUUIDPipe) followingId: string,
  ) {
    return this.followService.follow(followerId, followingId);
  }

  @Delete(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfollow(
    @CurrentUser('id') followerId: string,
    @Param('id', ParseUUIDPipe) followingId: string,
  ) {
    return this.followService.unfollow(followerId, followingId);
  }

  @Get(':id/followers')
  getFollowers(@Param('id', ParseUUIDPipe) userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':id/following')
  getFollowing(@Param('id', ParseUUIDPipe) userId: string) {
    return this.followService.getFollowing(userId);
  }
}
