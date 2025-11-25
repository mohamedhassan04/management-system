import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ClientStatus } from 'src/shared/enum/enum.type';

export class UpdateClientStatusDto {
  @ApiProperty({ enum: ClientStatus, default: ClientStatus.ACTIVE })
  @IsEnum(ClientStatus)
  status: ClientStatus;
}
