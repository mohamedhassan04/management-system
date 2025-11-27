import { Module } from '@nestjs/common';
import { SupllierService } from './supllier.service';
import { SupllierController } from './supllier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supllier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupllierController],
  providers: [SupllierService],
})
export class SupllierModule {}
