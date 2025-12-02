import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { Node } from 'src/shared/node/common.entity';
import { InvoicePaymentStatus } from 'src/shared/enum/enum.type';
import { Client } from 'src/modules/clients/entities/client.entity';

@Entity('tb_invoice')
export class Invoice extends Node {
  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @Column({
    type: 'enum',
    enum: InvoicePaymentStatus,
    default: InvoicePaymentStatus.DRAFT,
  })
  status: InvoicePaymentStatus;

  @Column({ nullable: true })
  invoiceNo: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paymentDate: Date;

  @Column({ nullable: true })
  notes: string;
}
