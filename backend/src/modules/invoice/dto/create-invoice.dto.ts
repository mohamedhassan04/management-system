import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'a1b2c3', description: 'Product ID' })
  @IsUUID('4')
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity purchased' })
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({
    example: 0,
    required: false,
    description: 'Discount amount applied on unit price',
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    example: 19,
    required: false,
    description: 'Tax rate percentage (e.g., 19 for 19%)',
  })
  @IsOptional()
  @IsNumber()
  taxRate?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({
    example: 'c7f8f2a1-7b42-4e88-9f43-d5f1b1d5e8c3',
    required: false,
    description: 'Client ID (optional if walk-in client)',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({
    type: [CreateInvoiceItemDto],
    description: 'List of items inside the invoice',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @ApiProperty({
    example: 'Thanks for your purchase!',
    required: false,
    description: 'Optional notes on invoice',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
