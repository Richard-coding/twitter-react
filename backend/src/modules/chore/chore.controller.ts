import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChoreService } from './chore.service';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';
import { CreateChoreAssignmentDto } from './dto/create-chore-assignment.dto';
import { UpdateChoreAssignmentDto } from './dto/update-chore-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('chores')
@UseGuards(JwtAuthGuard)
export class ChoreController {
  constructor(private readonly choreService: ChoreService) {}

  @Get()
  findAll() {
    return this.choreService.findAll();
  }

  @Post()
  createChore(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateChoreDto,
  ) {
    return this.choreService.createChore(userId, dto);
  }

  @Patch(':id')
  updateChore(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateChoreDto,
  ) {
    return this.choreService.updateChore(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteChore(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.choreService.deleteChore(id, userId);
  }

  @Get('assignments')
  findAssignments(
    @Query('userId') userId?: string,
    @Query('pending') pending?: string,
    @Query('dueBefore') dueBefore?: string,
  ) {
    return this.choreService.findAssignments({
      userId,
      pending: pending === 'true',
      dueBefore,
    });
  }

  @Post('assignments')
  createAssignment(@Body() dto: CreateChoreAssignmentDto) {
    return this.choreService.createAssignment(dto);
  }

  @Patch('assignments/:id')
  updateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateChoreAssignmentDto,
  ) {
    return this.choreService.updateAssignment(id, userId, dto);
  }

  @Delete('assignments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.choreService.deleteAssignment(id, userId);
  }

  @Patch('assignments/:id/complete')
  completeAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.choreService.completeAssignment(id, userId);
  }

  @Patch('assignments/:id/uncomplete')
  uncompleteAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.choreService.uncompleteAssignment(id);
  }
}
