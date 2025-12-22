import { Module } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimate } from './entities/estimate.entity';
import { EmailService } from 'src/shared/send-mail/mail.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { Invoice } from '../invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estimate, Invoice]), InvoiceModule],
  controllers: [EstimateController],
  providers: [EstimateService, EmailService],
})
export class EstimateModule {}
