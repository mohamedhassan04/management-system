import { Client } from 'src/modules/clients/entities/client.entity';
import { UserRole } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity('tb_user')
export class Users extends Node {
  @Column({ type: 'varchar', length: 40 })
  firstName: string;

  @Column({ type: 'varchar', length: 40 })
  lastName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Client, (client) => client.user)
  client: Client[];
}
