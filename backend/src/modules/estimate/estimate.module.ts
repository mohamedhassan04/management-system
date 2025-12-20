import { Module } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimate } from './entities/estimate.entity';
import { EmailService } from 'src/shared/send-mail/mail.service';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estimate]), InvoiceModule],
  controllers: [EstimateController],
  providers: [EstimateService, EmailService],
})
export class EstimateModule {}
