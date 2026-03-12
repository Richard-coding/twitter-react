import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { HouseEvent } from './house-event.entity';
import { RsvpStatus } from '../../../common/enums';

@Entity('event_rsvps')
@Unique(['userId', 'eventId'])
@Index(['eventId'])
export class EventRsvp extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => HouseEvent, (event) => event.rsvps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: HouseEvent;

  @Column({ type: 'enum', enum: RsvpStatus })
  status: RsvpStatus;
}
