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
import { ImprovementService } from './improvement.service';
import { CreateImprovementDto } from './dto/create-improvement.dto';
import { UpdateImprovementDto } from './dto/update-improvement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@Controller('improvements')
@UseGuards(JwtAuthGuard)
export class ImprovementController {
  constructor(private readonly service: ImprovementService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateImprovementDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImprovementDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.service.updateStatus(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.service.remove(id, user);
  }
}
