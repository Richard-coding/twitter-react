import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chore } from './entities/chore.entity';
import { ChoreAssignment } from './entities/chore-assignment.entity';
import { ChoreService } from './chore.service';
import { ChoreController } from './chore.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chore, ChoreAssignment]), AuthModule],
  controllers: [ChoreController],
  providers: [ChoreService],
})
export class ChoreModule {}
