import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { compareSync } from 'bcryptjs';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { SessionsService } from '../sessions/src/sessions.service';
import { User } from '@prisma/client';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.googleLogin';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionsService) { }

  async validateUser(data: AccountValidate.Request): Promise<AccountRegister.Response> {
    const user = await this.userService.findByEmailWithPassword(data.email);

    if (!user)
      throw new RpcException(new UnauthorizedException('User with such email was not found'));

    const isCorrectPassword = compareSync(data.password, user.password);

    if (!isCorrectPassword)
      throw new RpcException(new UnauthorizedException('Wrong password'));

    return { id: user.id, email: user.email, role: user.role, isEmailConfirmed: user.isEmailConfirmed }
  }

  async register(dto: AccountRegister.Request) {
    return await this.userService.createUser(dto);
  }

  async login(payload: ITokenPayload): Promise<AccountLogin.Response> {
    const user = await this.userService.findUserByEmail(payload.email.toString());
    if (!user.isEmailConfirmed) {
      throw new RpcException(new UnauthorizedException('Email is not confirmed'));
    }
    let access_token = await this.getAccessToken(payload);

    const refreshToken = this.getJwtRefreshToken(payload);
    await this.sessionService.createOrUpdateSession(user.id, refreshToken);

    return {
      access_token,
      refreshToken
    }
  }

  async refresh(req: User): Promise<AccountRefresh.Response> {

    const payload: ITokenPayload = { email: req.email };

    const access_token = await this.getAccessToken(payload);

    const refreshToken = this.getJwtRefreshToken(payload);

    await this.sessionService.createOrUpdateSession(req.id, refreshToken);

    return { access_token, refreshToken };
  }

  private getJwtRefreshToken(payload: ITokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })
    return refreshToken;
  }


  private async getAccessToken(payload: ITokenPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  async getUserIfRefreshTokenMatches(email: string, refreshToken: string) {
    const user = await this.userService.findUserByEmail(email);
    const refreshTokenFromDB = await this.sessionService.getRefreshToken(user.id);

    if (refreshToken !== refreshTokenFromDB.refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }
    return user;

  }

  async googleLogin(data: AccountGoogleLogin.Request): Promise<AccountLogin.Response> {
    let user = await this.userService.findUserByEmail(data.email.toString())
    if (!user) {
      user = await this.userService.createUserWithoutPassword(data);
    }
    const payload: ITokenPayload = { email: data.email };
    let access_token = await this.getAccessToken(payload)
    const refreshToken = this.getJwtRefreshToken(payload);
    await this.sessionService.createOrUpdateSession(user.id, refreshToken);

    return { access_token, refreshToken }
  }



}