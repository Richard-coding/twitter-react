import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ImprovementType, ImprovementStatus } from '../../../common/enums';

@Entity('improvements')
@Index(['createdById'])
@Index(['status'])
export class Improvement extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ImprovementType })
  type: ImprovementType;

  @Column({
    type: 'enum',
    enum: ImprovementStatus,
    default: ImprovementStatus.OPEN,
  })
  status: ImprovementStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;
}
