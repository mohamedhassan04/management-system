import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estimate } from './entities/estimate.entity';
import { DataSource, In, Repository } from 'typeorm';
import { EmailService } from 'src/shared/send-mail/mail.service';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../product/entities/product.entity';
import { generateNumero } from 'src/shared/utils/utils';
import {
  EstimateStatus,
  InvoicePaymentStatus,
} from 'src/shared/enum/enum.type';
import { EstimateItem } from './entities/estimate-item.entity';
import * as path from 'path';
import * as pdf from 'html-pdf';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import writtenNumber from 'written-number';
import { InvoiceQueryDto } from 'src/shared/dto/pagination-query.dto';
import { CreateInvoiceDto } from '../invoice/dto/create-invoice.dto';
import dayjs from 'dayjs';
import { InvoiceService } from '../invoice/invoice.service';
import { Invoice } from '../invoice/entities/invoice.entity';

@Injectable()
export class EstimateService {
  constructor(
    @InjectRepository(Estimate)
    private readonly _estimateRepository: Repository<Estimate>,
    @InjectRepository(Invoice)
    private readonly _invoiceRepository: Repository<Invoice>,
    private readonly _invoiceService: InvoiceService,
    private readonly dataSource: DataSource,
    private readonly mailerService: EmailService,
  ) {}

  async createEstimate(createEstimateDto: CreateEstimateDto) {
    return this.dataSource.transaction(async (manager) => {
      let client: Client | null = null;

      if (createEstimateDto.clientId) {
        client = await manager.findOne(Client, {
          where: { id: createEstimateDto.clientId },
        });
        if (!client) {
          throw new NotFoundException('Client introuvable');
        }
      }

      const productIds = createEstimateDto.items.map((i) => i.productId);
      const products = await manager.find(Product, {
        where: { id: In(productIds) },
      });

      if (products.length !== productIds.length) {
        throw new Error('Un ou plusieurs produits introuvables');
      }

      let subtotal = 0;
      let taxTotal = 0;

      const numero = await generateNumero({
        repo: this._estimateRepository,
        dateColumn: 'date',
        numberColumn: 'estimateNo',
        padding: 4,
      });

      // Create estimate entity
      const estimate = manager.create(Estimate, {
        client,
        estimateNo: numero,
        status: createEstimateDto.status || EstimateStatus.DRAFT,
        date: createEstimateDto.date,
        notes: createEstimateDto.notes || null,
        items: [],
      });

      for (const itemDto of createEstimateDto.items) {
        const product = products.find((p) => p.id === itemDto.productId);
        if (!product) throw new NotFoundException('Produit introuvable');

        // Deduct quantity
        await manager.save(product);

        const discount = itemDto.discount ?? 0;
        const taxRate = itemDto.taxRate ?? 0;

        const priceAfterDiscount = product.price - discount;
        const lineTax = priceAfterDiscount * itemDto.qty * (taxRate / 100);
        const lineTotal = priceAfterDiscount * itemDto.qty + lineTax;

        subtotal += priceAfterDiscount * itemDto.qty;
        taxTotal += lineTax;

        const estimateItem = manager.create(EstimateItem, {
          product,
          qty: itemDto.qty,
          unitPrice: product.price,
          discount,
          taxRate,
          lineTotal,
        });

        estimate.items.push(estimateItem); // Add item to estimate
      }

      // Set totals
      estimate.subtotal = subtotal;
      estimate.taxTotal = taxTotal;
      estimate.total = subtotal + taxTotal;

      // Save estimate and all items (cascade handles estimateItems)
      await manager.save(estimate);
      // Return estimate with items and product info
      return {
        HttpStatus: HttpStatus.CREATED,
        message: 'Devis crée avec success',
      };
    });
  }

  async findAllEstimates(query: InvoiceQueryDto) {
    const { limit = 10, page = 1, search, status } = query;

    const qb = this._estimateRepository
      .createQueryBuilder('estimate')
      .leftJoin('estimate.client', 'client')
      .select(['estimate', 'client.id', 'client.firstName', 'client.lastName']);

    if (status) {
      qb.where('estimate.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `client.firstName ILIKE :search 
          OR client.lastName ILIKE :search
          OR estimate.estimateNo ILIKE :search
         `,
        { search: `%${search}%` },
      );
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('estimate.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async sendDevisViaEmail(estimateId: string) {
    const estimate = await this._estimateRepository.findOne({
      where: { id: estimateId },
      relations: ['client', 'items', 'items.product'],
    });

    if (!estimate) {
      throw new NotFoundException('Devis introuvable');
    }

    if (!estimate.client?.email) {
      throw new NotFoundException('Email client introuvable');
    }

    const estimateFile = await this.generateEstimatePdf(estimate);

    estimate.status = EstimateStatus.SENT;

    await this._estimateRepository.save(estimate);

    await this.mailerService.sendEstimateEmail(
      estimateFile,
      estimate?.client?.email,
    );

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Devis envoyé avec success',
    };
  }

  async getEstimateById(estimateId: string) {
    return await this._estimateRepository.findOne({
      where: { id: estimateId },
      relations: ['client', 'items', 'items.product'],
    });
  }

  async generateEstimatePdf(estimate: Estimate): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'estimate',
      'templates',
      'estimate.hbs',
    );

    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);

    const dinars = Math.floor(estimate.total);
    const millimes = Math.round((estimate.total - dinars) * 1000);

    const amountInWords =
      writtenNumber(dinars, { lang: 'fr' }) +
      ' dinar' +
      (dinars > 1 ? 's' : '') +
      (millimes > 0
        ? ' et ' +
          writtenNumber(millimes, { lang: 'fr' }) +
          ' millime' +
          (millimes > 1 ? 's' : '')
        : '');

    const data = {
      numEstimate: estimate?.estimateNo,
      date: estimate?.date,
      customer: {
        name: estimate?.client?.firstName + ' ' + estimate?.client?.lastName,
        phoneNumber: estimate?.client?.phone,
        address: estimate.client?.address,
        email: estimate.client?.email,
      },
      items: [
        ...estimate.items.map((item) => ({
          product: item.product.productName,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          lineTotal: item.lineTotal,
        })),
      ],
      totalHT: estimate.subtotal,
      totalTVA: estimate.taxTotal,
      totalTTC: estimate.total,
      amountInWords,
    };

    const html = template(data);

    return new Promise((resolve, reject) => {
      pdf.create(html, { format: 'A4' }).toBuffer((err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });
  }

  async convertEstimateToInvoice(estimateId: string) {
    const estimate = await this._estimateRepository.findOne({
      where: { id: estimateId },
      relations: ['client', 'items', 'items.product'],
    });

    if (!estimate) {
      throw new NotFoundException('Devis introuvable');
    }

    if (estimate.status === EstimateStatus.FACTURED) {
      throw new BadRequestException('Ce devis est déjà facturé');
    }

    if (estimate.status !== EstimateStatus.ACCEPTED) {
      throw new BadRequestException(
        'Seuls les devis acceptés peuvent être facturés',
      );
    }

    if (!estimate.client?.email) {
      throw new NotFoundException('Email client introuvable');
    }

    const numero = await generateNumero({
      repo: this._invoiceRepository,
      dateColumn: 'createdAt',
      numberColumn: 'invoiceNo',
      padding: 3,
    });

    const createInvoiceDto: CreateInvoiceDto = {
      clientId: estimate.client.id,
      dueDate: dayjs(estimate.date).format('YYYY-MM-DD'),
      status: InvoicePaymentStatus.DRAFT,
      invoiceNo: numero,
      notes: `Facture générée depuis le devis ${estimate.estimateNo}`,
      items: estimate.items.map((item) => ({
        productId: item.product.id,
        qty: item.qty,
        discount: item.discount ?? 0,
        taxRate: item.taxRate ?? 0,
      })),
    };

    await this._invoiceService.createInvoice(createInvoiceDto);

    estimate.status = EstimateStatus.FACTURED;
    await this._estimateRepository.save(estimate);

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Devis facturé avec success',
    };
  }
}
