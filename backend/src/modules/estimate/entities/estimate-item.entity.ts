import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { Node } from 'src/shared/node/common.entity';
import { Estimate } from './estimate.entity';

@Entity('tb_estimate_item')
export class EstimateItem extends Node {
  @ManyToOne(() => Estimate, (Estimate) => Estimate.items)
  @JoinColumn({ name: 'estimateId' })
  estimate: Estimate;

  @ManyToOne(() => Product, { nullable: true })
  product: Product;

  @Column({ nullable: true })
  qty: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxRate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lineTotal: number;
}
