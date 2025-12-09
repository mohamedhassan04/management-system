import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductQueryDto } from 'src/shared/dto/pagination-query.dto';
import { ProductStock } from 'src/shared/enum/enum.type';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddStockDto } from './dto/add-stock-product.dto';
import dayjs from 'dayjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async createProduct(createProductDto: CreateProductDto) {
    const productExist = await this._productRepo.findOne({
      where: {
        productName: createProductDto.productName,
      },
    });

    if (productExist) {
      throw new Error('Produit déja existant');
    }

    const product = this._productRepo.create(createProductDto);

    if (product.quantity <= 3) {
      product.status = ProductStock.LOW_STOCK;
    }

    product.lastRestock = dayjs().toDate();
    await this._productRepo.save(product);
    await this.cacheManager.clear();
    return {
      HttpStatus: HttpStatus.CREATED,
      message: 'Produit ajouté avec success',
    };
  }

  async findAllProducts(query: ProductQueryDto) {
    const { limit = 10, page = 1, category, search, status } = query;
    // Cache key
    const cacheKey = `products:${page}:${limit}:${status || 'all'}:${search || 'none'}`;

    try {
      // Try to get cached data
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      } else {
        console.log(
          'All products data not found in cache, fetching from database.',
        );
      }
    } catch (cacheError) {
      console.error('Cache GET Error:', cacheError);
    }
    const qb = this._productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.supllier', 'supllier')
      .select([
        'product',
        'category.id',
        'category.name',
        'supllier.id',
        'supllier.supplierName',
      ]);

    if (category) {
      qb.where('category.name = :name', { name: category });
    }

    if (status) {
      qb.andWhere('product.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `product.productName ILIKE :search 
        OR product.sku ILIKE :search
       `,
        { search: `%${search}%` },
      );
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('product.createdAt', 'DESC');

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

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this._productRepo.findOne({
      where: { id: id },
    });

    if (product) {
      await this._productRepo.update(id, updateProductDto);
      await this.cacheManager.clear();
      return {
        status: HttpStatus.OK,
        success: 'Produit mis à jour avec success',
      };
    }
  }

  async addStockToProduct(id: string, addStockDto: AddStockDto) {
    const product = await this._productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    product.quantity += addStockDto.quantity;
    product.lastRestock = dayjs().toDate();
    product.status = this.computeStockStatus(product.quantity);

    await this._productRepo.save(product);
    await this.cacheManager.clear();
    return {
      status: HttpStatus.OK,
      success: 'Stock mis à jour avec succès',
    };
  }

  async removeProduct(id: string) {
    const product = await this._productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    await this._productRepo.softDelete(product.id);
    await this.cacheManager.clear();
    return {
      status: HttpStatus.OK,
      success: 'Produit supprimé avec success',
    };
  }

  // Private functions
  private computeStockStatus(quantity: number): ProductStock {
    if (quantity <= 3) return ProductStock.LOW_STOCK;
    return ProductStock.IN_STOCK;
  }
}
