import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Chore } from './chore.entity';

@Entity('chore_assignments')
@Index(['choreId'])
@Index(['assignedToId'])
@Index(['dueDate'])
export class ChoreAssignment extends BaseEntity {
  @Column({ name: 'chore_id' })
  choreId: string;

  @ManyToOne(() => Chore, (chore) => chore.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chore_id' })
  chore: Chore;

  @Column({ name: 'assigned_to_id' })
  assignedToId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'completed_by_id', nullable: true })
  completedById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'completed_by_id' })
  completedBy: User | null;
}
