import { Product } from 'src/modules/product/entities/product.entity';
import { Node } from 'src/shared/node/common.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('tb_category')
export class Category extends Node {
  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @Column()
  name: string;
}
