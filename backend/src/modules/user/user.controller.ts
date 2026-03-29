import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  ForbiddenException,
  Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":username/profile")
  getProfile(
    @Param("username") username: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    return this.userService.getProfile(username, currentUserId);
  }

  @Get(":username/likes")
  getLikedPosts(
    @Param("username") username: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    return this.userService.getLikedPosts(username, currentUserId);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    if (id !== currentUserId) throw new ForbiddenException("Access denied");
    return this.userService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id !== currentUserId) throw new ForbiddenException("Access denied");
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    if (id !== currentUserId) throw new ForbiddenException("Access denied");
    return this.userService.remove(id);
  }
}
