import { Entity, Column, OneToMany } from 'typeorm';
import { Node } from 'src/shared/node/common.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Entity('tb_supplier')
export class Supplier extends Node {
  @Column({ unique: true })
  supplierName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @OneToMany(() => Product, (product) => product.supllier)
  products: Product[];
}
