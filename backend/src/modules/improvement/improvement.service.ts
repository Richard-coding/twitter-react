import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Improvement } from './entities/improvement.entity';
import { CreateImprovementDto } from './dto/create-improvement.dto';
import { UpdateImprovementDto } from './dto/update-improvement.dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class ImprovementService {
  constructor(
    @InjectRepository(Improvement)
    private readonly repo: Repository<Improvement>,
  ) {}

  findAll(): Promise<Improvement[]> {
    return this.repo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  create(userId: string, dto: CreateImprovementDto): Promise<Improvement> {
    const improvement = this.repo.create({
      title: dto.title,
      description: dto.description ?? null,
      type: dto.type,
      createdById: userId,
    });
    return this.repo.save(improvement);
  }

  async updateStatus(
    id: string,
    dto: UpdateImprovementDto,
    currentUser: { id: string; role: UserRole },
  ): Promise<Improvement> {
    const improvement = await this.repo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!improvement) throw new NotFoundException('Improvement not found');

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isOwner = improvement.createdById === currentUser.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Only the creator or an admin can update status');
    }

    if (dto.status !== undefined) improvement.status = dto.status;
    return this.repo.save(improvement);
  }

  async remove(id: string, currentUser: { id: string; role: UserRole }): Promise<void> {
    const improvement = await this.repo.findOne({ where: { id } });
    if (!improvement) throw new NotFoundException('Improvement not found');

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isOwner = improvement.createdById === currentUser.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Only the creator or an admin can delete');
    }

    await this.repo.remove(improvement);
  }
}
