import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request as RequestType } from 'express';

import { ExtractJwt, Strategy } from 'passport-jwt';

import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
        private readonly apiGatewayAuthService: ApiGatewayAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtAuthStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }
    static extractJWT(req: RequestType): string | null {
        if (req.cookies && 'access_token' in req.cookies) {
            return req.cookies['access_token'];
        }
        return null;
    }
    async validate(payload: AccountGetUserByEmail.Request) {
        return await this.apiGatewayAuthService.getUserByEmail(payload);
    }
}