import { PartialType } from '@nestjs/mapped-types';
import { CreateSupllierDto } from './create-supllier.dto';

export class UpdateSupllierDto extends PartialType(CreateSupllierDto) {}
