import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingItemStatus } from '../../common/enums';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly listRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingItem)
    private readonly itemRepository: Repository<ShoppingItem>,
  ) {}

  private async getCurrentList(): Promise<ShoppingList> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    let list = await this.listRepository.findOne({ where: { year, month } });
    if (!list) {
      list = this.listRepository.create({ year, month });
      list = await this.listRepository.save(list);
    }
    return list;
  }

  async getCurrent(): Promise<ShoppingList> {
    const list = await this.getCurrentList();
    return this.listRepository.findOne({
      where: { id: list.id },
      relations: ['items', 'items.addedBy', 'items.boughtBy'],
    }) as Promise<ShoppingList>;
  }

  async getByMonth(year: number, month: number): Promise<ShoppingList> {
    const list = await this.listRepository.findOne({
      where: { year, month },
      relations: ['items', 'items.addedBy', 'items.boughtBy'],
    });
    if (!list) throw new NotFoundException('Shopping list not found for this period');
    return list;
  }

  async addItem(userId: string, dto: CreateShoppingItemDto): Promise<ShoppingItem> {
    const list = await this.getCurrentList();
    const item = this.itemRepository.create({
      name: dto.name,
      quantity: dto.quantity ?? null,
      category: dto.category ?? null,
      listId: list.id,
      addedById: userId,
    });
    return this.itemRepository.save(item);
  }

  async updateItem(itemId: string, dto: UpdateShoppingItemDto): Promise<ShoppingItem> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');

    if (dto.name !== undefined) item.name = dto.name;
    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.category !== undefined) item.category = dto.category;

    return this.itemRepository.save(item);
  }

  async deleteItem(itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');
    await this.itemRepository.remove(item);
  }

  async markAsBought(itemId: string, userId: string): Promise<ShoppingItem> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');

    item.status = ShoppingItemStatus.BOUGHT;
    item.boughtById = userId;
    return this.itemRepository.save(item);
  }

  async uncheck(itemId: string): Promise<ShoppingItem> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');

    item.status = ShoppingItemStatus.PENDING;
    item.boughtById = null;
    return this.itemRepository.save(item);
  }
}
