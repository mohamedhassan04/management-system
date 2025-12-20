import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { EstimateStatus } from 'src/shared/enum/enum.type';

export class CreateEstimateItemDto {
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

export class CreateEstimateDto {
  @ApiProperty({
    example: 'c7f8f2a1-7b42-4e88-9f43-d5f1b1d5e8c3',
    required: false,
    description: 'Client ID (optional if walk-in client)',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ example: '2025-12-31', description: 'Invoice due date' })
  @IsString()
  date: string;

  @ApiProperty({
    type: [CreateEstimateItemDto],
    description: 'List of items inside the invoice',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEstimateItemDto)
  items: CreateEstimateItemDto[];

  @ApiProperty({
    example: 'Thanks for your purchase!',
    required: false,
    description: 'Optional notes on invoice',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: EstimateStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(EstimateStatus)
  status?: EstimateStatus;
}
