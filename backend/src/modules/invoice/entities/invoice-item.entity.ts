import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Node } from 'src/shared/node/common.entity';

@Entity('tb_invoice_item')
export class InvoiceItem extends Node {
  @ManyToOne(() => Invoice, (invoice) => invoice.items)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

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
