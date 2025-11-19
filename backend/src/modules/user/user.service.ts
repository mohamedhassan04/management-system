import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly _userRepo: Repository<Users>,
  ) {}
  async register(createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      const user = this._userRepo.create(createUserDto);

      // Check if email already exists
      const existingUser = await this._userRepo.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt();
      const passwordHash = createUserDto.password;
      const hash = await bcrypt.hash(passwordHash, salt);

      // Save user
      hash && (user.password = hash);

      //For not return the password in the response
      const { password, ...result } = user;
      await this._userRepo.save(user);

      return {
        message: 'Compte créé. Veuillez vérifier votre email.',
        HttpStatus: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(email: string) {
    return await this._userRepo.findOne({
      where: { email: email },
    });
  }

  async deleteUser(id: string) {
    return await this._userRepo.delete(id);
  }

  async findOneUserById(id: string) {
    const user = await this._userRepo.findOne({
      where: { id: id },
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Utilisateur introuvable',
      };
    }

    if (user) {
      const { password, ...result } = user;
      return { status: HttpStatus.OK, success: result };
    }
  }
}
