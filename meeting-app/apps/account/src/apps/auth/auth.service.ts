import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UsersService } from '../users/src/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { compareSync } from 'bcryptjs';
import { AccounLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService) { }

  async validateUser(email: string, password: string): Promise<AccountRegister.Response> {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user)
      throw new RpcException(new UnauthorizedException('User with such email was not found'));

    const isCorrectPassword = compareSync(password, user.password);

    if (!isCorrectPassword)
      throw new RpcException(new UnauthorizedException('Wrong password'));

    return { id: user.id, email: user.email, role: user.role }
  }

  async register(dto: AccountRegister.Request) {
    return await this.userService.createUser(dto);
  }

  async login(dto: AccounLogin.Request): Promise<AccounLogin.Response> {
    const { email, password } = dto;
    const { id } = await this.validateUser(email, password);
    console.log(id)
    return {
      access_token: await this.jwtService.signAsync(
        { id },
        { expiresIn: '30s' }
      )
    }
  }
}