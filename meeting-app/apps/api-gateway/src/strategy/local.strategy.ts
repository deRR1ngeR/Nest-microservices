import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Strategy } from 'passport-local';

import { AuthService } from '../../../account/src/apps/auth/auth.service';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private apiGatewayAuthService: ApiGatewayAuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        const user = await this.apiGatewayAuthService.validateUser({ email, password });
        if (!user) {
            throw new RpcException(new UnauthorizedException('Something got wrong'));
        }
        return user;
    }
}