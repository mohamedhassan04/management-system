import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvoicePaymentStatus } from 'src/shared/enum/enum.type';

export class UpdateInvoiceStatusDto {
  @ApiProperty({
    type: 'string',
    example: 'payé',
  })
  @IsEnum(InvoicePaymentStatus)
  @IsNotEmpty()
  status: InvoicePaymentStatus;
}
