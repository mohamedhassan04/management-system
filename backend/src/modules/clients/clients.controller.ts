import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { Users } from '../user/entities/user.entity';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClientQueryDto } from 'src/shared/dto/pagination-query.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  //@Method POST
  //@desc Create new client
  //@Path: /create
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful create client.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error create client.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create')
  async create(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: Users,
  ) {
    return await this.clientsService.createClient(createClientDto, user);
  }

  //@Method GET
  //@desc Get  all clients by user
  //@Path: /all-clients-by-user
  @ApiOperation({ summary: 'Find all clients by user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful find all clients.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error find all clients.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('all-clients-by-user')
  async findAllClientsByUser(
    @Query() query: ClientQueryDto,
    @GetUser() user: Users,
  ) {
    return await this.clientsService.findAllClientsByUser(query, user);
  }

  //@Method PATCH
  //@desc update client status
  //@Path: /update-status
  @ApiOperation({ summary: 'Update client status' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful update client status.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error update client status.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('update-status')
  async updateInvoiceStatus(
    @Query('id') id: string,
    @Body() body: UpdateClientStatusDto,
  ) {
    return await this.clientsService.updateInvoiceStatus(id, body.status);
  }

  //@Method PATCH
  //@desc update client status
  //@Path: /update-client
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful update client.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error update client.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put('update-client')
  async updateClient(
    @Query('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientsService.updateClient(id, updateClientDto);
  }

  //@Method DELETE
  //@desc remove client
  //@Path: /remove-client
  @ApiOperation({ summary: 'remove client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful remove client.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error remove client.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete('remove-client')
  async remove(@Query('id') id: string) {
    return await this.clientsService.removeClient(id);
  }
}
