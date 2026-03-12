import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Chore } from './entities/chore.entity';
import { ChoreAssignment } from './entities/chore-assignment.entity';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';
import { CreateChoreAssignmentDto } from './dto/create-chore-assignment.dto';
import { UpdateChoreAssignmentDto } from './dto/update-chore-assignment.dto';
import { ChoreFrequency } from '../../common/enums';

@Injectable()
export class ChoreService {
  constructor(
    @InjectRepository(Chore)
    private readonly choreRepository: Repository<Chore>,
    @InjectRepository(ChoreAssignment)
    private readonly assignmentRepository: Repository<ChoreAssignment>,
  ) {}

  async findAll(): Promise<Chore[]> {
    return this.choreRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async createChore(userId: string, dto: CreateChoreDto): Promise<Chore> {
    const chore = this.choreRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      frequency: dto.frequency ?? ChoreFrequency.WEEKLY,
      createdById: userId,
    });
    return this.choreRepository.save(chore);
  }

  async updateChore(choreId: string, userId: string, dto: UpdateChoreDto): Promise<Chore> {
    const chore = await this.choreRepository.findOne({ where: { id: choreId } });
    if (!chore) throw new NotFoundException('Chore not found');
    if (chore.createdById !== userId) throw new ForbiddenException('Access denied');

    if (dto.name !== undefined) chore.name = dto.name;
    if (dto.description !== undefined) chore.description = dto.description;
    if (dto.frequency !== undefined) chore.frequency = dto.frequency;

    return this.choreRepository.save(chore);
  }

  async deleteChore(choreId: string, userId: string): Promise<void> {
    const chore = await this.choreRepository.findOne({ where: { id: choreId } });
    if (!chore) throw new NotFoundException('Chore not found');
    if (chore.createdById !== userId) throw new ForbiddenException('Access denied');
    await this.choreRepository.remove(chore);
  }

  async findAssignments(filters: {
    userId?: string;
    pending?: boolean;
    dueBefore?: string;
  }): Promise<ChoreAssignment[]> {
    const query = this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.chore', 'chore')
      .leftJoinAndSelect('assignment.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignment.completedBy', 'completedBy');

    if (filters.userId) {
      query.andWhere('assignment.assigned_to_id = :userId', { userId: filters.userId });
    }

    if (filters.pending) {
      query.andWhere('assignment.completed_at IS NULL');
    }

    if (filters.dueBefore) {
      query.andWhere('assignment.due_date <= :dueBefore', { dueBefore: filters.dueBefore });
    }

    return query.orderBy('assignment.due_date', 'ASC').getMany();
  }

  async createAssignment(dto: CreateChoreAssignmentDto): Promise<ChoreAssignment> {
    const chore = await this.choreRepository.findOne({ where: { id: dto.choreId } });
    if (!chore) throw new NotFoundException('Chore not found');

    const assignment = this.assignmentRepository.create({
      choreId: dto.choreId,
      assignedToId: dto.assignedToId,
      dueDate: dto.dueDate,
    });
    return this.assignmentRepository.save(assignment);
  }

  async updateAssignment(
    assignmentId: string,
    userId: string,
    dto: UpdateChoreAssignmentDto,
  ): Promise<ChoreAssignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const chore = await this.choreRepository.findOne({ where: { id: assignment.choreId } });
    if (!chore || chore.createdById !== userId) throw new ForbiddenException('Access denied');

    if (dto.assignedToId !== undefined) assignment.assignedToId = dto.assignedToId;
    if (dto.dueDate !== undefined) assignment.dueDate = dto.dueDate;

    return this.assignmentRepository.save(assignment);
  }

  async deleteAssignment(assignmentId: string, userId: string): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const chore = await this.choreRepository.findOne({ where: { id: assignment.choreId } });
    if (!chore || chore.createdById !== userId) throw new ForbiddenException('Access denied');

    await this.assignmentRepository.remove(assignment);
  }

  async completeAssignment(assignmentId: string, userId: string): Promise<ChoreAssignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.completedAt = new Date();
    assignment.completedById = userId;
    return this.assignmentRepository.save(assignment);
  }

  async uncompleteAssignment(assignmentId: string): Promise<ChoreAssignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.completedAt = null;
    assignment.completedById = null;
    return this.assignmentRepository.save(assignment);
  }
}
