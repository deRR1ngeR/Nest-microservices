import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { AccountRegister } from 'libs/common/contracts/account/account.register';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';
import { Observable } from 'rxjs';
import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';


@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(private readonly configService: ConfigService,
        private readonly apiGatewayAuthService: ApiGatewayAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies['refresh_token'];
                }
            ]),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_REFRESH_TOKEN'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, { email }: ITokenPayload): Promise<AccountRegister.Response> {
        const refreshToken = req?.cookies['refresh_token'];
        return await this.apiGatewayAuthService.getUserIfRefreshTokenMatches(email, refreshToken);

    }
}