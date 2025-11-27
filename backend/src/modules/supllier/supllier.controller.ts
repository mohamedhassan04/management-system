import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { SupllierService } from './supllier.service';
import { CreateSupllierDto } from './dto/create-supllier.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('Supllier')
@Controller('supllier')
export class SupllierController {
  constructor(private readonly supllierService: SupllierService) {}

  //@Method POST
  //@desc Create a new supllier
  //@Path: /create
  @ApiOperation({ summary: 'Create a new supllier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Supllier created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create supllier.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async createSupllier(@Body() createSupllierDto: CreateSupllierDto) {
    return await this.supllierService.createSupllier(createSupllierDto);
  }

  //@Method GET
  //@desc Find all supllier
  //@Path: /find-all
  @ApiOperation({ summary: 'Find all supllier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'All supllier found successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to find all supllier.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('find-all')
  async findAllSupllier() {
    return await this.supllierService.findAllSupllier();
  }
}
