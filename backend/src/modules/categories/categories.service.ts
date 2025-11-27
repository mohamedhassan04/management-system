import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly _categoryRepo: Repository<Category>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = this._categoryRepo.create(createCategoryDto);
    await this._categoryRepo.save(category);
    return {
      message: 'Categorie ajouté avec success',
      httpStatus: HttpStatus.CREATED,
    };
  }

  async findAllCategories() {
    return await this._categoryRepo.find({
      select: ['id', 'name'],
    });
  }
}
