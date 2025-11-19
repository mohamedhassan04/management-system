import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Request as ExpressRequest, Response as Res } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) {}

  //@Method POST
  //@desc Login user
  //@Path: /login
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Logged Successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User Logged Failed.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() loginUserDto: LoginUserDto,
    @Response() res: Res,
  ) {
    try {
      const { success } = await this.authService.login(req.user, loginUserDto);

      // Set the httpOnly cookie for 4 hours
      res.cookie('access_token', success.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 4 * 60 * 60 * 1000,
      });

      // Send response
      return res.status(HttpStatus.OK).json({
        success: {
          name: success.name,
          access_token: success.access_token,
        },
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred during login',
        error: error.message,
      });
    }
  }

  //@Method POST
  //@desc Register user
  //@Path: /register
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register User Successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Register User Failed.',
  })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.userService.register(createUserDto, req);
  }

  //@Method GET
  //@desc Get Current User
  //@Path: /current
  @ApiOperation({ summary: 'Current user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Current User Successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Current User Failed.',
  })
  @ApiCookieAuth('token')
  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Request() req: any) {
    const access_token = req.cookies['access_token'];
    const user = req?.user?.user;
    return {
      status: HttpStatus.OK,
      success: {
        access_token,
        user,
      },
    };
  }

  //@Method POST
  //@desc Logout from my account
  //@Path: /logout
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Logout User Successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Logout User Failed.',
  })
  @Post('logout')
  async logout(@Response() res: Res) {
    res.clearCookie('access_token');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Se déconnecter avec success',
    });
  }
}
