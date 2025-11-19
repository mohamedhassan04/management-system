import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'user',
  })
  @IsString()
  @MinLength(2, { message: 'firstName must have atleast 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'lastName must have atleast 3 characters.' })
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail(
    { allow_display_name: true },
    { message: 'Please provide a valid Email.' },
  )
  email: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @ApiProperty({
    type: 'string',
    example: '20 329 911',
  })
  @IsString()
  @MinLength(2, { message: 'Phone must have atleast 2 characters.' })
  @MaxLength(8, { message: 'Phone must have maximum 8 characters.' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: 'string',
    example: '33 rue de la paix paris',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: 'string',
    example: 'Bech i5ales par facilité sur 3 mois',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
