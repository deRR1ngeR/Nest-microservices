import { Injectable, UnauthorizedException } from '@nestjs/common';

import { $Enums, User } from '@prisma/client';

import { PrismaService } from 'libs/common/database/prisma.service';
import { genSaltSync, hashSync } from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { AccountRegister } from 'libs/common/contracts/account/account.register';

@Injectable()
export class UsersService {

  constructor(private readonly db: PrismaService) { }

  async createUser(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    const isUserExist = await this.findUserByEmail(dto.email);
    if (isUserExist) {
      throw new RpcException(new UnauthorizedException('User with such email is already exists'));
    }

    const salt = genSaltSync(10);

    const newUser: AccountRegister.Request = {
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

  async findUserByEmail(email: string): Promise<AccountRegister.Response> {
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
