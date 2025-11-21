import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductQueryDto } from 'src/shared/dto/pagination-query.dto';
import { ProductStock } from 'src/shared/enum/enum.type';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddStockDto } from './dto/add-stock-product.dto';
import dayjs from 'dayjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
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

    return {
      HttpStatus: HttpStatus.CREATED,
      message: 'Produit ajouté avec success',
    };
  }

  async findAllProducts(query: ProductQueryDto) {
    const { limit = 10, page = 1, category, productName, sku } = query;

    const qb = this._productRepo.createQueryBuilder('product');

    if (category) {
      qb.where('product.category = :category', { category });
    }

    if (productName) {
      qb.andWhere('product.productName LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    if (sku) {
      qb.andWhere('product.sku LIKE :sku', { sku: `%${sku}%` });
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('product.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this._productRepo.findOne({
      where: { id: id },
    });

    if (product) {
      await this._productRepo.update(id, updateProductDto);
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

    await this._productRepo.remove(product);

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
