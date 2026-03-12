import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList, ShoppingItem]), AuthModule],
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
