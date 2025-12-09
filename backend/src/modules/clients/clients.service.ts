import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Users } from '../user/entities/user.entity';
import { ClientQueryDto } from 'src/shared/dto/pagination-query.dto';
import { ClientStatus } from 'src/shared/enum/enum.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly _clientRepo: Repository<Client>,
    @InjectRepository(Users) private readonly _userRepo: Repository<Users>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async createClient(createClientDto: CreateClientDto, user: Users) {
    const exist = await this._userRepo.findOneBy({ id: user.id });

    if (!exist) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const client = this._clientRepo.create(createClientDto);
    client.user = exist;
    await this._clientRepo.save(client);

    return {
      message: 'Client créé avec succès',
      HttpStatus: HttpStatus.CREATED,
    };
  }

  async findAllClientsByUser(query: ClientQueryDto, user: Users) {
    const { limit = 10, page = 1, status, search } = query;

    // Cache key
    const cacheKey = `clients:${user.id}:${page}:${limit}:${status || 'all'}:${search || 'none'}`;

    try {
      // Try to get cached data
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      } else {
        console.log(
          'All clients data not found in cache, fetching from database.',
        );
      }
    } catch (cacheError) {
      console.error('Cache GET Error:', cacheError);
    }

    const qb = this._clientRepo
      .createQueryBuilder('client')
      .leftJoin('client.user', 'user')
      .where('user.id = :id', { id: user.id });

    if (status) {
      qb.andWhere('client.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(client.firstName ILIKE :search 
        OR client.lastName ILIKE :search
        OR client.email ILIKE :search
        OR client.phone ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('client.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    const result = {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };

    await this.cacheManager.set(cacheKey, result, 360000);

    return result;
  }

  async updateInvoiceStatus(id: string, status: ClientStatus) {
    const client = await this._clientRepo.findOneBy({ id });

    if (!client) throw new NotFoundException('Client introuvable');

    client.status = status;

    await this._clientRepo.save(client);

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Statut de client mis à jour avec success',
    };
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const exist = await this._clientRepo.findOneBy({ id: id });

    if (!exist) throw new NotFoundException('Client introuvable');

    await this._clientRepo.update(id, updateClientDto);
    return {
      message: 'Client mis à jour avec success',
      HttpStatus: HttpStatus.OK,
    };
  }

  async removeClient(id: string) {
    const exist = await this._clientRepo.findOneBy({ id: id });

    if (!exist) throw new NotFoundException('Client introuvable');

    await this._clientRepo.softDelete(exist.id);
    return {
      message: 'Client supprimé avec success',
      HttpStatus: HttpStatus.OK,
    };
  }
}
