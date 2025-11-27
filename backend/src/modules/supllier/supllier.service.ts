import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSupllierDto } from './dto/create-supllier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supllier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupllierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly _supllierRepo: Repository<Supplier>,
  ) {}
  async createSupllier(createSupllierDto: CreateSupllierDto) {
    const supplier = this._supllierRepo.create(createSupllierDto);
    await this._supllierRepo.save(supplier);
    return {
      message: 'Fournisseur crée avec success',
      httpStatus: HttpStatus.CREATED,
    };
  }

  async findAllSupllier() {
    return await this._supllierRepo.find({
      select: ['id', 'supplierName'],
    });
  }
}
