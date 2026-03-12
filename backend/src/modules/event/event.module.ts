import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseEvent } from './entities/house-event.entity';
import { EventRsvp } from './entities/event-rsvp.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([HouseEvent, EventRsvp]), AuthModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
