import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Improvement } from './entities/improvement.entity';
import { ImprovementService } from './improvement.service';
import { ImprovementController } from './improvement.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Improvement]), AuthModule],
  controllers: [ImprovementController],
  providers: [ImprovementService],
})
export class ImprovementModule {}
