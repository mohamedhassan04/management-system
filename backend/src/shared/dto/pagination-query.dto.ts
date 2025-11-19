import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CartegoryProduct } from '../enum/enum.type';

export class ProductQueryDto {
  @ApiPropertyOptional({ default: 10, description: 'Items per page' })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({ description: 'Search by category name' })
  @IsOptional()
  @IsEnum(CartegoryProduct)
  category?: CartegoryProduct;

  @ApiPropertyOptional({ description: 'Search by product name' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Search by SKU' })
  @IsOptional()
  @IsString()
  sku?: string;
}
