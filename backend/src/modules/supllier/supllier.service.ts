import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupllierDto } from './dto/create-supllier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supllier.entity';
import { Repository } from 'typeorm';
import { ClientQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateSupllierDto } from './dto/update-supllier.dto';

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

  async findAllSupllierByQuery(query: ClientQueryDto) {
    const { limit = 10, page = 1, search } = query;
    const qb = this._supllierRepo.createQueryBuilder('supplier');

    if (search) {
      qb.andWhere(
        `supplier.supplierName ILIKE :search 
          OR supplier.email ILIKE :search
          OR supplier.phoneNumber ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('supplier.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async updateSupllier(id: string, updateSupllierDto: UpdateSupllierDto) {
    const exist = await this._supllierRepo.findOneBy({ id: id });

    if (!exist) throw new NotFoundException('Fournisseur introuvable');

    await this._supllierRepo.update(id, updateSupllierDto);
    return {
      message: 'Fournisseur mis à jour avec success',
      HttpStatus: HttpStatus.OK,
    };
  }
}
