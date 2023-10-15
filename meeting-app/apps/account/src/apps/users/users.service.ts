import { Injectable, UnauthorizedException } from '@nestjs/common';

import { $Enums, User } from '@prisma/client';

import { PrismaService } from 'libs/common/database/prisma.service';
import { genSaltSync, hashSync } from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.google-login';
import { AccountMarkEmailAsConfirmed } from 'libs/common/contracts/account/account.markEmailAsConfirmed';
import { AccountRoleUpdate } from 'libs/common/contracts/account/account.roleUpdate';

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
      name: dto.name,
      password: hashSync(dto.password, salt),
      profile_photo: dto.profile_photo,
    }

    return this.db.user.create({
      data: {
        ...newUser,
        isEmailConfirmed: false,
        role: $Enums.Role.USER
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailConfirmed: true
      }
    })
  }

  async findUserByEmail(email: string): Promise<AccountRegister.Response> {
    return await this.db.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailConfirmed: true
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

  async markEmailAsConfirmed(data: AccountMarkEmailAsConfirmed.Request): Promise<AccountMarkEmailAsConfirmed.Response> {
    return this.db.user.update({
      where: {
        email: data.toString()
      },
      data: {
        isEmailConfirmed: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailConfirmed: true
      }
    }
    );
  }

  async createUserWithoutPassword(dto: AccountGoogleLogin.Request): Promise<AccountRegister.Response> {

    const newUser: AccountRegister.Request = {
      email: dto.email.toString(),
      name: dto.name,
      profile_photo: dto.profile_photo
    }

    return this.db.user.create({
      data: {
        ...newUser,
        isEmailConfirmed: true,
        role: $Enums.Role.USER
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailConfirmed: true
      }
    })
  }

  async roleUpdate(data: string): Promise<AccountRegister.Response> {
    return await this.db.user.update({
      where: {
        email: data
      },
      data: {
        role: $Enums.Role.ORGANIZER
      }
    })
  }
}
