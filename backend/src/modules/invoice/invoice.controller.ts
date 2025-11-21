import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Patch,
  Put,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { InvoiceQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateInvoiceStatusDto } from './dto/update-status.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Response } from 'express';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  //@Method POST
  //@desc Create a new invoice
  //@Path: /create
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Invoice created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create invoice.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.createInvoice(createInvoiceDto);
  }

  //@Method GET
  //@desc Get all invoices
  //@Path: /all-invoices
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get all invoices successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get all invoices.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('all-invoices')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'dueDate', required: false })
  async findAllProducts(@Query() query: InvoiceQueryDto) {
    return await this.invoiceService.findAllInvoices(query);
  }

  //@Method PATCH
  //@desc Update invoice status
  //@Path: /update-status-invoices
  @ApiOperation({ summary: 'Update status invoices' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update status invoices successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update status invoices.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('update-status-invoices')
  async updateInvoiceStatus(
    @Query('id') id: string,
    @Body() updateInvoiceStatusDto: UpdateInvoiceStatusDto,
  ) {
    return await this.invoiceService.updateInvoiceStatus(
      id,
      updateInvoiceStatusDto.status,
    );
  }

  //@Method PUT
  //@desc update invoice
  //@Path: /update-invoice
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update invoice successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update invoice.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put('update-invoice')
  async updateInvoice(
    @Query('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return await this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }

  //@Method POST
  //@desc send reminder email payment
  //@Path: /send-reminder
  @ApiOperation({ summary: 'Send reminder email payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Send reminder email payment successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to send reminder email payment.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('send-reminder')
  async sendReminderPaymentEmail(@Query('id') id: string) {
    return await this.invoiceService.sendReminderPaymentEmail(id);
  }

  //@Method GET
  //@desc Generate and download invoice PDF
  //@Path: /facture/generate-invoice

  //@Method POST
  //@desc send reminder email payment
  //@Path: /send-reminder
  @ApiOperation({ summary: 'Generate and download invoice PDF' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Generate and download invoice PDF successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to generate and download invoice PDF.',
  })
  @ApiCookieAuth('access_token')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('USER')
  @Get('generate-invoice')
  async generateInvoice(
    @Query('factureId') factureId: string,
    @Res() res: Response,
  ) {
    const facture = await this.invoiceService.getFactureById(factureId);
    if (!facture) throw new NotFoundException('Facture introuvable');

    const pdfBuffer = await this.invoiceService.generateInvoicePdf(facture);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${factureId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
