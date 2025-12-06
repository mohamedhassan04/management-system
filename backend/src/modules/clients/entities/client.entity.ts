import { Users } from 'src/modules/user/entities/user.entity';
import { ClientStatus } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from 'typeorm';

@Entity('tb_clients')
export class Client extends Node {
  @Column({ type: 'varchar', length: 40 })
  firstName: string;

  @Column({ type: 'varchar', length: 40 })
  lastName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.ACTIVE })
  status: ClientStatus;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

  @DeleteDateColumn({ nullable: true, type: 'timestamp' })
  deletedAt?: Date;

  @ManyToOne(() => Users, (client) => client.client, { cascade: true })
  user: Users;
}
