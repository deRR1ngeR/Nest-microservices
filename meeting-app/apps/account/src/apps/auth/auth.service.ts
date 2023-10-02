import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'libs/common/contracts/users/dtos/create-user.dto';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UsersService } from '../users/src/users.service';
import RequestWithUser from 'libs/common/contracts/users/requests/requset-with-user.interface';
import { LoginResponse } from 'libs/common/contracts/users/responses/login.response';
import ITokenPayload from './interfaces/token-payload.interface';
import { AccessTokenResponse } from './responses/access-token.response';
import { JwtService } from '@nestjs/jwt';
import { serialize } from 'cookie';
import { ConfigService } from '@nestjs/config';
import { IRefreshTokenCookie } from './interfaces/refresh-token-cookie.interface';
import { UserResponse } from 'libs/common/contracts/users/responses/user.response';
import { RpcException } from '@nestjs/microservices';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService) { }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user)
      throw new RpcException(new UnauthorizedException('User with such email was not found'));

    const isCorrectPassword = compareSync(password, user.password);

    if (!isCorrectPassword)
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);

    return { id: user.id, email: user.email, role: user.role }
  }

  async register(dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  async login(req: RequestWithUser): Promise<LoginResponse> {
    const payload: ITokenPayload = { email: req.user.email };
    const accessToken = this.getAccessToken(payload);
    const { refreshToken, refreshTokenCookie } = this.getCookieWithJwtRefreshToken(payload);
    // await this.sessionService.createOrUpdateSession(req.user.id, refreshToken);
    req.res.setHeader('Set-Cookie', refreshTokenCookie);
    return {
      accessToken,
      user: req.user
    };
  }

  private getAccessToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  private getCookieWithJwtRefreshToken(payload: ITokenPayload): IRefreshTokenCookie {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })
    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
    })

    return { refreshToken, refreshTokenCookie };
  }

  async refresh(req: RequestWithUser): Promise<AccessTokenResponse> {

    const payload: ITokenPayload = { email: req.user.email };

    const accessToken = this.getAccessToken(payload);

    const { refreshToken, refreshTokenCookie } = this.getCookieWithJwtRefreshToken(payload);

    // await this.sessionService.createOrUpdateSession(req.user.id, refreshToken);

    req.res.setHeader('Set-Cookie', refreshTokenCookie);

    return { accessToken };
  }

  // async getUserIfRefreshTokenMatches(email: string, refreshToken: string) {
  //   const user = await this.userService.findUserByEmail(email);

  //   const refreshTokenFromDB = await this.sessionService.getRefreshToken(user.id);

  //   if (refreshToken !== refreshTokenFromDB) {
  //     throw new ForbiddenException('Invalid refresh token');
  //   }
  //   return user;

  // }
}
