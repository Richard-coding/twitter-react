import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ShoppingItem } from './shopping-item.entity';

@Entity('shopping_lists')
@Unique(['year', 'month'])
export class ShoppingList extends BaseEntity {
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @OneToMany(() => ShoppingItem, (item) => item.list)
  items: ShoppingItem[];
}
