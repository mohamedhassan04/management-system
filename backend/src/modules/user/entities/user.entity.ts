import { UserRole } from 'src/shared/enum/enum.type';
import { Node } from 'src/shared/node/common.entity';
import { Column, Entity, Index } from 'typeorm';

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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
