import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateSupllierDto {
  @ApiProperty({
    description: 'Unique supplier name',
    example: 'Global Tech Imports',
  })
  @IsNotEmpty()
  @IsString()
  supplierName: string;

  @ApiProperty({
    description: 'Supplier phone number',
    example: '+216 55 555 555',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Supplier email address',
    example: 'contact@supplier.com',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.email !== null && o.email !== '')
  @IsEmail()
  email?: string | null;

  @ApiProperty({
    description: 'Supplier physical address',
    example: 'Tunis, Tunisia',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
