import { Client } from 'src/modules/clients/entities/client.entity';
import { EstimateStatus } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EstimateItem } from './estimate-item.entity';

@Entity('tb_estimate')
export class Estimate extends Node {
  @OneToMany(() => EstimateItem, (item) => item.estimate, { cascade: true })
  items: EstimateItem[];

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @Column({
    type: 'enum',
    enum: EstimateStatus,
    default: EstimateStatus.DRAFT,
  })
  status: EstimateStatus;

  @Column({ nullable: true, unique: true })
  estimateNo: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  notes: string;

  @DeleteDateColumn({ nullable: true, type: 'timestamp' })
  deletedAt?: Date;
}
