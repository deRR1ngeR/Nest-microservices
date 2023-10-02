import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { $Enums, User } from '@prisma/client';

import { CreateUserDto } from 'libs/common/contracts/users/dtos/create-user.dto';
import { PrismaService } from 'libs/common/database/prisma.service';
import { genSaltSync, hashSync } from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { UserResponse } from 'libs/common/contracts/users/responses/user.response';

@Injectable()
export class UsersService {

  constructor(private readonly db: PrismaService) { }

  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const isUserExist = await this.findUserByEmail(dto.email);
    console.log(isUserExist)
    if (isUserExist) {
      console.log('err')
      throw new RpcException(new UnauthorizedException('User with such email was not found'));

    }

    const salt = genSaltSync(10);

    const newUser: CreateUserDto = {
      email: dto.email,
      password: hashSync(dto.password, salt),
      profile_photo: ''
    }

    return this.db.user.create({
      data: {
        ...newUser,
        role: $Enums.Role.USER
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })
  }

  async findUserByEmail(email: string): Promise<UserResponse> {
    return await this.db.user.findUnique({
      where: {
        email: email
      }
    });
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    return await this.db.user.findUnique({
      where: {
        email: email
      }
    })
  }
}
