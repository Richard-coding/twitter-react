import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ChoreAssignment } from './chore-assignment.entity';
import { ChoreFrequency } from '../../../common/enums';

@Entity('chores')
@Index(['createdById'])
export class Chore extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ChoreFrequency, default: ChoreFrequency.WEEKLY })
  frequency: ChoreFrequency;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(() => ChoreAssignment, (assignment) => assignment.chore)
  assignments: ChoreAssignment[];
}
