import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Put,
  Delete,
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
import { ClientQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateSupllierDto } from './dto/update-supllier.dto';

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

  //@Method GET
  //@desc Get  all clients by query
  //@Path: /all-supllier-by-query
  @ApiOperation({ summary: 'Find all suplliers by query' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful find all suplliers.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error find all suplliers.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('all-supllier-by-query')
  async findAllSupllierByQuery(@Query() query: ClientQueryDto) {
    return await this.supllierService.findAllSupllierByQuery(query);
  }

  //@Method PUT
  //@desc update supllier status
  //@Path: /update-supllier
  @ApiOperation({ summary: 'Update supllier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful update supllier.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error update supllier.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put('update-supllier')
  async updateSupllier(
    @Query('id') id: string,
    @Body() updateSupllierDto: UpdateSupllierDto,
  ) {
    return await this.supllierService.updateSupllier(id, updateSupllierDto);
  }

  //@Method DELETE
  //@desc remove supllier
  //@Path: /remove-supllier
  @ApiOperation({ summary: 'remove supllier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful remove supllier.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error remove supllier.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete('remove-supllier')
  async remove(@Query('id') id: string) {
    return await this.supllierService.removeSupllier(id);
  }
}
