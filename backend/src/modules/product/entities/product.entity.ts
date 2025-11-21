import { CartegoryProduct, ProductStock } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('tb_product')
export class Product extends Node {
  @Column({ unique: true })
  @Index()
  productName: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: CartegoryProduct })
  @Index()
  category: CartegoryProduct;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  @Index()
  sku: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ProductStock,
    default: ProductStock.IN_STOCK,
    nullable: true,
  })
  status: ProductStock;

  @Column({ type: 'date', nullable: true })
  lastRestock: Date;

  @Column()
  supllier: string;
}
