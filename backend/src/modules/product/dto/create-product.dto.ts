import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Supplier } from 'src/modules/supllier/entities/supllier.entity';

export class CreateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'Smasnug 32" Smart TV',
  })
  @IsString()
  @MinLength(2, { message: 'product name must have atleast 4 characters.' })
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    type: 'string',
    example: 'Caracteristics of the product',
  })
  @IsString()
  @MinLength(4, { message: 'description must have atleast 4 characters.' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    example: '6f68a50d-a9c0-4a6e-9a81-7d542e68b527',
  })
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    type: 'number',
    example: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: 'string',
    example: '61911254474461232',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    type: 'number',
    example: 0,
  })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    type: 'string',
    example: '6f68a50d-a9c0-4a6e-9a81-7d542e68b527',
  })
  @IsNotEmpty()
  supllier: Supplier;
}
