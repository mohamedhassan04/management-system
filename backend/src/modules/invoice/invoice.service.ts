import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Product } from '../product/entities/product.entity';
import { InvoicePaymentStatus, ProductStock } from 'src/shared/enum/enum.type';
import dayjs from 'dayjs';
import * as path from 'path';
import * as pdf from 'html-pdf';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import writtenNumber from 'written-number';
import { InvoiceQueryDto } from 'src/shared/dto/pagination-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/shared/send-mail/mail.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Client } from '../clients/entities/client.entity';
import { generateNumero } from 'src/shared/utils/utils';

writtenNumber.defaults.lang = 'fr';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly _invoiceRepo: Repository<Invoice>,
    private readonly dataSource: DataSource,
    private readonly mailerService: EmailService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    return this.dataSource.transaction(async (manager) => {
      let client: Client | null = null;

      if (createInvoiceDto.clientId) {
        client = await manager.findOne(Client, {
          where: { id: createInvoiceDto.clientId },
        });
        if (!client) {
          throw new NotFoundException('Client introuvable');
        }
      }

      const productIds = createInvoiceDto.items.map((i) => i.productId);
      const products = await manager.find(Product, {
        where: { id: In(productIds) },
      });

      if (products.length !== productIds.length) {
        throw new Error('Un ou plusieurs produits introuvables');
      }

      let subtotal = 0;
      let taxTotal = 0;

      const numero = await generateNumero({
        repo: this._invoiceRepo,
        dateColumn: 'createdAt',
        numberColumn: 'invoiceNo',
        padding: 3,
      });

      // Create invoice entity
      const invoice = manager.create(Invoice, {
        client,
        invoiceNo: numero,
        status: createInvoiceDto.status || InvoicePaymentStatus.DRAFT,
        dueDate: createInvoiceDto.dueDate,
        paymentDate: createInvoiceDto.paymentDate || null,
        notes: createInvoiceDto.notes || null,
        items: [],
      });

      for (const itemDto of createInvoiceDto.items) {
        const product = products.find((p) => p.id === itemDto.productId);
        if (!product) throw new NotFoundException('Produit introuvable');
        if (product.quantity < itemDto.qty) {
          throw new BadRequestException(
            `Quantité insuffisante pour le produit ${product.productName}`,
          );
        }

        // Deduct quantity
        product.quantity -= itemDto.qty;
        if (product.quantity <= 3) product.status = ProductStock.LOW_STOCK;
        if (product.quantity === 0) product.status = ProductStock.OUT_OF_STOCK;
        await manager.save(product);

        const discount = itemDto.discount ?? 0;
        const taxRate = itemDto.taxRate ?? 0;

        const priceAfterDiscount = product.price - discount;
        const lineTax = priceAfterDiscount * itemDto.qty * (taxRate / 100);
        const lineTotal = priceAfterDiscount * itemDto.qty + lineTax;

        subtotal += priceAfterDiscount * itemDto.qty;
        taxTotal += lineTax;

        const invoiceItem = manager.create(InvoiceItem, {
          product,
          qty: itemDto.qty,
          unitPrice: product.price,
          discount,
          taxRate,
          lineTotal,
        });

        invoice.items.push(invoiceItem); // Add item to invoice
      }

      // Set totals
      invoice.subtotal = subtotal;
      invoice.taxTotal = taxTotal;
      invoice.total = subtotal + taxTotal;

      // Save invoice and all items (cascade handles invoiceItems)
      await manager.save(invoice);
      // Return invoice with items and product info
      return {
        HttpStatus: HttpStatus.CREATED,
        message: 'Facture crée avec success',
      };
    });
  }

  async findAllInvoices(query: InvoiceQueryDto) {
    const { limit = 10, page = 1, search, status } = query;

    const qb = this._invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoin('invoice.client', 'client')
      .select(['invoice', 'client.id', 'client.firstName', 'client.lastName']);

    if (status) {
      qb.where('invoice.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `client.firstName ILIKE :search 
        OR client.lastName ILIKE :search
        OR invoice.invoiceNo ILIKE :search
       `,
        { search: `%${search}%` },
      );
    }

    // if (dueDate) {
    //   qb.andWhere(`TO_CHAR(invoice.dueDate, 'YYYY-MM-DD') LIKE :dueDate`, {
    //     dueDate: `%${dueDate}%`,
    //   });
    // }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    qb.orderBy('invoice.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async updateInvoiceStatus(id: string, status: InvoicePaymentStatus) {
    const invoice = await this._invoiceRepo.findOneBy({ id });

    if (!invoice) throw new NotFoundException('Facture introuvable');

    invoice.status = status;

    if (status === InvoicePaymentStatus.PAID) {
      invoice.paymentDate = dayjs().toDate();
    }

    await this._invoiceRepo.save(invoice);

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Statut de la facture mis à jour avec success',
    };
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.dataSource.transaction(async (manager) => {
      const invoice = await manager.findOne(Invoice, {
        where: { id },
        relations: ['items', 'items.product', 'client'],
      });

      if (!invoice) {
        throw new NotFoundException('Facture introuvable');
      }

      // Update client if provided
      if (updateInvoiceDto.clientId) {
        const client = await manager.findOne(Client, {
          where: { id: updateInvoiceDto.clientId },
        });
        if (!client) throw new NotFoundException('Client introuvable');
        invoice.client = client;
      }

      // Update simple fields
      invoice.notes = updateInvoiceDto.notes ?? invoice.notes;
      invoice.dueDate = updateInvoiceDto.dueDate ?? invoice.dueDate;

      // ---------------------------
      // ITEMS UPDATE (ONLY MODIFIED)
      // ---------------------------
      if (updateInvoiceDto.items) {
        const oldItems = invoice.items;

        // get incoming ids (if exist)
        const incomingIds = updateInvoiceDto.items
          .filter((i) => i.id)
          .map((i) => i.id);

        // 1) Delete items that are not in incoming
        for (const oldItem of oldItems) {
          if (!incomingIds.includes(oldItem.id)) {
            const product = await manager.findOne(Product, {
              where: { id: oldItem.product.id },
            });

            // restore stock
            product.quantity += oldItem.qty;
            product.status =
              product.quantity > 3
                ? ProductStock.IN_STOCK
                : product.quantity > 0
                  ? ProductStock.LOW_STOCK
                  : ProductStock.OUT_OF_STOCK;

            await manager.save(product);
            await manager.delete(InvoiceItem, { id: oldItem.id });
          }
        }

        let subtotal = 0;
        let taxTotal = 0;
        const updatedItems: InvoiceItem[] = [];

        for (const itemDto of updateInvoiceDto.items) {
          const product = await manager.findOne(Product, {
            where: { id: itemDto.productId },
          });

          if (!product) throw new NotFoundException('Produit introuvable');

          let invoiceItem: InvoiceItem;

          // EXISTS → update
          if (itemDto.id) {
            invoiceItem = await manager.findOne(InvoiceItem, {
              where: { id: itemDto.id },
              relations: ['product'],
            });

            if (!invoiceItem) throw new NotFoundException('Item introuvable');

            // Restore stock from old qty
            const oldProduct = await manager.findOne(Product, {
              where: { id: invoiceItem.product.id },
            });

            oldProduct.quantity += invoiceItem.qty;
            oldProduct.status =
              oldProduct.quantity > 3
                ? ProductStock.IN_STOCK
                : oldProduct.quantity > 0
                  ? ProductStock.LOW_STOCK
                  : ProductStock.OUT_OF_STOCK;

            await manager.save(oldProduct);
          }

          // NEW → create
          else {
            invoiceItem = new InvoiceItem();
            invoiceItem.invoice = invoice;
          }

          // decrease stock with new qty
          if (product.quantity < itemDto.qty) {
            throw new BadRequestException(
              `Quantité insuffisante pour le produit ${product.productName}`,
            );
          }

          product.quantity -= itemDto.qty;

          if (product.quantity === 0)
            product.status = ProductStock.OUT_OF_STOCK;
          else if (product.quantity <= 3)
            product.status = ProductStock.LOW_STOCK;
          else product.status = ProductStock.IN_STOCK;

          await manager.save(product);

          // Calculate totals
          const discount = itemDto.discount ?? 0;
          const taxRate = itemDto.taxRate ?? 0;

          const priceAfterDiscount = product.price - discount;
          const lineTax = priceAfterDiscount * itemDto.qty * (taxRate / 100);
          const lineTotal = priceAfterDiscount * itemDto.qty + lineTax;

          subtotal += priceAfterDiscount * itemDto.qty;
          taxTotal += lineTax;

          invoiceItem.product = product;
          invoiceItem.qty = itemDto.qty;
          invoiceItem.unitPrice = product.price;
          invoiceItem.discount = discount;
          invoiceItem.taxRate = taxRate;
          invoiceItem.lineTotal = lineTotal;

          await manager.save(invoiceItem);
          updatedItems.push(invoiceItem);
        }

        // assign totals
        invoice.items = updatedItems;
        invoice.subtotal = subtotal;
        invoice.taxTotal = taxTotal;
        invoice.total = subtotal + taxTotal;
      }

      // Save final invoice update
      await manager.save(invoice);

      return {
        HttpStatus: HttpStatus.OK,
        message: 'Facture mise à jour avec succès',
      };
    });
  }

  async sendReminderPaymentEmail(id: string) {
    const invoice = await this._invoiceRepo.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!invoice) throw new NotFoundException('Facture introuvable');

    await this.mailerService.sendEmailReminder(
      invoice?.client?.email,
      invoice?.client?.firstName,
      invoice.invoiceNo,
      invoice.total,
      invoice.dueDate,
    );

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Email envoyé avec success',
    };
  }

  async getFactureById(invoiceId: string): Promise<Invoice> {
    return this._invoiceRepo.findOne({
      where: { id: invoiceId },
      relations: ['client', 'items', 'items.product'],
    });
  }

  async generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'invoice',
      'templates',
      'invoice.hbs',
    );

    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);

    const dinars = Math.floor(invoice.total);
    const millimes = Math.round((invoice.total - dinars) * 1000);

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
      numInvoice: `${new Date().getMonth()}-${new Date().getFullYear()}`,
      dueDate: invoice.dueDate,
      customer: {
        name: invoice?.client?.firstName + ' ' + invoice?.client?.lastName,
        phoneNumber: invoice?.client?.phone,
        address: invoice.client?.address,
        email: invoice.client?.email,
      },
      items: [
        ...invoice.items.map((item) => ({
          product: item.product.productName,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          lineTotal: item.lineTotal,
        })),
      ],
      totalHT: invoice.subtotal,
      totalTVA: invoice.taxTotal,
      totalTTC: invoice.total,
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

  async deleteInvoice(id: string) {
    const invoice = await this._invoiceRepo.findOne({ where: { id } });

    if (!invoice) {
      throw new NotFoundException('Facture introuvable');
    }

    await this._invoiceRepo.softDelete(invoice.id);
    return {
      status: HttpStatus.OK,
      success: 'Facture supprimé avec success',
    };
  }
}
