import { Category } from 'src/modules/categories/entities/category.entity';
import { Supplier } from 'src/modules/supllier/entities/supllier.entity';
import { ProductStock } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from 'typeorm';

@Entity('tb_product')
export class Product extends Node {
  @Column({ unique: true })
  @Index()
  productName: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  @Index()
  sku: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  taxRate: string;

  @Column({
    type: 'enum',
    enum: ProductStock,
    default: ProductStock.IN_STOCK,
    nullable: true,
  })
  status: ProductStock;

  @Column({ type: 'date', nullable: true })
  lastRestock: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp' })
  deletedAt?: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
  })
  supllier: Supplier;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;
}
