import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, LessThan, Repository } from 'typeorm';
import { HouseEvent } from './entities/house-event.entity';
import { EventRsvp } from './entities/event-rsvp.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RsvpDto } from './dto/rsvp.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(HouseEvent)
    private readonly eventRepository: Repository<HouseEvent>,
    @InjectRepository(EventRsvp)
    private readonly rsvpRepository: Repository<EventRsvp>,
  ) {}

  async findUpcoming(): Promise<HouseEvent[]> {
    return this.eventRepository.find({
      where: { startsAt: MoreThanOrEqual(new Date()) },
      relations: ['createdBy', 'rsvps', 'rsvps.user'],
      order: { startsAt: 'ASC' },
    });
  }

  async findPast(): Promise<HouseEvent[]> {
    return this.eventRepository.find({
      where: { startsAt: LessThan(new Date()) },
      relations: ['createdBy', 'rsvps', 'rsvps.user'],
      order: { startsAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<HouseEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'rsvps', 'rsvps.user'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(userId: string, dto: CreateEventDto): Promise<HouseEvent> {
    const event = this.eventRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      startsAt: new Date(dto.startsAt),
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      location: dto.location ?? null,
      createdById: userId,
    });
    return this.eventRepository.save(event);
  }

  async update(eventId: string, userId: string, dto: UpdateEventDto): Promise<HouseEvent> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.createdById !== userId) throw new ForbiddenException('Access denied');

    if (dto.title !== undefined) event.title = dto.title;
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.startsAt !== undefined) event.startsAt = new Date(dto.startsAt);
    if (dto.endsAt !== undefined) event.endsAt = new Date(dto.endsAt);
    if (dto.location !== undefined) event.location = dto.location;

    return this.eventRepository.save(event);
  }

  async delete(eventId: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.createdById !== userId) throw new ForbiddenException('Access denied');
    await this.eventRepository.remove(event);
  }

  async upsertRsvp(eventId: string, userId: string, dto: RsvpDto): Promise<EventRsvp> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    let rsvp = await this.rsvpRepository.findOne({ where: { userId, eventId } });
    if (rsvp) {
      rsvp.status = dto.status;
    } else {
      rsvp = this.rsvpRepository.create({ userId, eventId, status: dto.status });
    }
    return this.rsvpRepository.save(rsvp);
  }

  async deleteRsvp(eventId: string, userId: string): Promise<void> {
    const rsvp = await this.rsvpRepository.findOne({ where: { userId, eventId } });
    if (!rsvp) throw new NotFoundException('RSVP not found');
    await this.rsvpRepository.remove(rsvp);
  }
}
