import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    example: 'Eléctronique',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
