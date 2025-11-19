import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { CartegoryProduct } from 'src/shared/enum/enum.type';

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
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    example: 'Eléctronique',
  })
  @IsEnum(CartegoryProduct)
  @IsNotEmpty()
  category: CartegoryProduct;

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
    example: 'STMT',
  })
  @IsString()
  @IsNotEmpty()
  supllier: string;
}
