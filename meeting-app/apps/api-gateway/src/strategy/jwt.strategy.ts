import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request as RequestType } from 'express';

import { ExtractJwt, Strategy } from 'passport-jwt';

import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
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
    async validate(payload: ITokenPayload) {
        return { id: payload.email };
    }
}