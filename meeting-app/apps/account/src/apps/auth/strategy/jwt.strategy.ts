import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';

import { UsersService } from '../../users/src/users.service';
import ITokenPayload from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
        private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_ACCESS_TOKEN')
        });
    }

    async validate({ email }: ITokenPayload) {
        return await this.userService.findUserByEmail(email);
    }
}