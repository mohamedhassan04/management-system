import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ProductQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddStockDto } from './dto/add-stock-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //@Method POST
  //@desc Create a new product
  //@Path: /create
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create product.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  //@Method GET
  //@desc Get all products
  //@Path: /all-products
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get all products successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get all products.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('all-products')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'productName', required: false })
  @ApiQuery({ name: 'sku', required: false })
  async findAllProducts(@Query() query: ProductQueryDto) {
    return await this.productService.findAllProducts(query);
  }

  //@Method PUT
  //@desc Update a product
  //@Path: /update-products
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update product.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put('update-product')
  async updateProduct(
    @Query('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  //@Method POST
  //@desc Add stock to a product
  //@Path: /add-stock
  @ApiOperation({ summary: 'Add stock to a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add stock successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to add stock.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('add-stock')
  async addStockToProduct(
    @Query('id') id: string,
    @Body() quantity: AddStockDto,
  ) {
    return await this.productService.addStockToProduct(id, quantity);
  }

  //@Method DELETE
  //@desc Delete a product
  //@Path: /delete-product
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Delete product successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to delete product.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete('delete-product')
  async removeProduct(@Query('id') id: string) {
    return await this.productService.removeProduct(id);
  }
}
