import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingItemStatus } from '../../../common/enums';

@Entity('shopping_items')
@Index(['listId'])
export class ShoppingItem extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  quantity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Column({
    type: 'enum',
    enum: ShoppingItemStatus,
    default: ShoppingItemStatus.PENDING,
  })
  status: ShoppingItemStatus;

  @Column({ name: 'list_id' })
  listId: string;

  @ManyToOne(() => ShoppingList, (list) => list.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: ShoppingList;

  @Column({ name: 'added_by_id' })
  addedById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'added_by_id' })
  addedBy: User;

  @Column({ name: 'bought_by_id', nullable: true })
  boughtById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bought_by_id' })
  boughtBy: User | null;
}
