import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddStockDto {
  @ApiProperty({
    type: 'number',
    example: 0,
  })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
