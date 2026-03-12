import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('shopping')
@UseGuards(JwtAuthGuard)
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get('current')
  getCurrent() {
    return this.shoppingService.getCurrent();
  }

  @Get(':year/:month')
  getByMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.shoppingService.getByMonth(year, month);
  }

  @Post('current/items')
  addItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateShoppingItemDto,
  ) {
    return this.shoppingService.addItem(userId, dto);
  }

  @Patch('items/:id')
  updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShoppingItemDto,
  ) {
    return this.shoppingService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.shoppingService.deleteItem(id);
  }

  @Patch('items/:id/buy')
  markAsBought(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.shoppingService.markAsBought(id, userId);
  }

  @Patch('items/:id/uncheck')
  uncheck(@Param('id', ParseUUIDPipe) id: string) {
    return this.shoppingService.uncheck(id);
  }
}
