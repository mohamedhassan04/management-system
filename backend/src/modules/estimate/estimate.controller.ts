import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Query,
  Res,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
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
import { Response } from 'express';
import { InvoiceQueryDto } from 'src/shared/dto/pagination-query.dto';

@ApiTags('Estimate')
@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  //@Method POST
  //@desc Create a new estimate
  //@Path: /create
  @ApiOperation({ summary: 'Create a new estimate' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'estimate created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create estimate.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async createEstimate(@Body() createEstimateDto: CreateEstimateDto) {
    return await this.estimateService.createEstimate(createEstimateDto);
  }

  //@Method GET
  //@desc Get all estimates
  //@Path: /all-estimates
  @ApiOperation({ summary: 'Get all estimates' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get all estimates successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get all estimates.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('all-estimates')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAllEstimates(@Query() query: InvoiceQueryDto) {
    return await this.estimateService.findAllEstimates(query);
  }

  //@Method POST
  //@desc Send estimate via email
  //@Path: /send-estimate
  @ApiOperation({ summary: 'Send estimate' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'estimate sent successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to send estimate.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('send-estimate')
  async sendDevisViaEmail(@Query('estimateId') estimateId: string) {
    return await this.estimateService.sendDevisViaEmail(estimateId);
  }

  //@Method POST
  //@desc Generate and download invoice PDF
  //@Path: /generate-estimate
  @ApiOperation({ summary: 'Generate and download estimate PDF' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Generate and download estimate PDF successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to generate and download estimate PDF.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('generate-estimate')
  async generateInvoice(
    @Query('estimateId') estimateId: string,
    @Res() res: Response,
  ) {
    const estimate = await this.estimateService.getEstimateById(estimateId);
    if (!estimate) throw new NotFoundException('Devis introuvable');

    const pdfBuffer = await this.estimateService.generateEstimatePdf(estimate);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=devis-${estimateId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  //@Method POST
  //@desc convert the estimate to an invoice
  //@Path: /convert-estimate
  @ApiOperation({ summary: 'Convert estimate' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'estimate converted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to convert estimate.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('convert-estimate')
  async convertEstimateToInvoice(@Query('estimateId') estimateId: string) {
    return await this.estimateService.convertEstimateToInvoice(estimateId);
  }
}
