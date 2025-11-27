import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //@Method POST
  //@desc Create a new category
  //@Path: /create
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create category.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  //@Method GET
  //@desc Find all categories
  //@Path: /find-all
  @ApiOperation({ summary: 'Find all categories' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'All categories found successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to find all categories.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('find-all')
  async findAllCategories() {
    return this.categoriesService.findAllCategories();
  }
}
