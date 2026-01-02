import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  /* Validate user credentials */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  /* Login function */
  async login(user: Users, loginUserDto: LoginUserDto) {
    const payload = {
      email: loginUserDto.email,
      sub: {
        id: user.id,
        email: loginUserDto.email,
        role: user.role,
        name: user.firstName + ' ' + user.lastName,
      },
    };
    return {
      status: 200,
      success: {
        name: user.firstName + ' ' + user.lastName,
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
