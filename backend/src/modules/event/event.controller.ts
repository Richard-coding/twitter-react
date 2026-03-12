import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RsvpDto } from './dto/rsvp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findUpcoming() {
    return this.eventService.findUpcoming();
  }

  @Get('past')
  findPast() {
    return this.eventService.findPast();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventService.delete(id, userId);
  }

  @Put(':id/rsvp')
  upsertRsvp(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RsvpDto,
  ) {
    return this.eventService.upsertRsvp(id, userId, dto);
  }

  @Delete(':id/rsvp')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRsvp(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventService.deleteRsvp(id, userId);
  }
}
