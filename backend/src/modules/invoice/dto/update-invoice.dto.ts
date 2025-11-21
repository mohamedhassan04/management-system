import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoicePaymentStatus } from 'src/shared/enum/enum.type';

class UpdateInvoiceItemDto {
  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  qty: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 19, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ example: 'Updated note...', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: '2025-12-31',
    required: false,
    description: 'New due date of the invoice',
  })
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    example: InvoicePaymentStatus.DRAFT,
    enum: InvoicePaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoicePaymentStatus)
  status?: InvoicePaymentStatus;

  @ApiProperty({
    type: [UpdateInvoiceItemDto],
    required: false,
    description:
      'If provided, ALL invoice items will be replaced by this new list',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateInvoiceItemDto)
  items?: UpdateInvoiceItemDto[];
}
