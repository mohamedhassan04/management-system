import {
  Controller,
  Get,
  Body,
  HttpStatus,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Method GET
  //@desc Get one user by email
  //@Path: /getUser
  @ApiOperation({ summary: 'Get One User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful Get One User.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error Get One User.',
  })
  @Get('getUser')
  findOne(@Body() email: string) {
    return this.userService.findOneUser(email);
  }

  //@Method GET
  //@desc Get one user by email
  //@Path: /getUser
  @ApiOperation({ summary: 'Get One User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful Get One User.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error Get One User.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  //@Method GET
  //@desc Get one user by id
  //@Path: /get-user-id
  @ApiOperation({ summary: 'Get One User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful Get One User.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error Get One User.',
  })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-user-id')
  findOneUserById(@Query('id') id: string) {
    return this.userService.findOneUserById(id);
  }
}
