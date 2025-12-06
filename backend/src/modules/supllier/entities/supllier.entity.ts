import { Entity, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { Node } from 'src/shared/node/common.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Entity('tb_supplier')
export class Supplier extends Node {
  @Column({ unique: true })
  supplierName: string;

  @Column()
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column()
  address: string;

  @DeleteDateColumn({ nullable: true, type: 'timestamp' })
  deletedAt?: Date;

  @OneToMany(() => Product, (product) => product.supllier)
  products: Product[];
}
