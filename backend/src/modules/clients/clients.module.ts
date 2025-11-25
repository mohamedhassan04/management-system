import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Users } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Users])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
