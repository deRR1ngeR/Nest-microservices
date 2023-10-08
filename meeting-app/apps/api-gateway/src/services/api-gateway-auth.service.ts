import { Inject, Injectable } from '@nestjs/common';

import { Response } from 'express';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { Observable, catchError, throwError } from 'rxjs';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiGatewayAuthService {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
        private readonly configService: ConfigService) { }

    register(dto: AccountRegister.Request): Observable<AccountRegister.Response> {
        return this.authService.send('register', dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)),
            ),
        );;
    }

    async login(dto: AccountLogin.Request, res: Response): Promise<AccountLogin.ResponseWithRefreshToken> {
        let { access_token, refreshToken } = await this.authService.send(AccountLogin.topic, dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        res.cookie(
            'access_token',
            access_token, {
            httpOnly: true,
            path: '/',
            maxAge: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
        }
        );
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
        });
        return { access_token, refreshToken }
    }

    async refresh(req: AccountRefresh.ReqWithUser, res: Response): Promise<AccountRefresh.Response> {
        let { access_token, refreshToken } = await this.authService.send(AccountRefresh.refreshCommand, req.user).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        console.log('Response ' + res)
        res.cookie(
            'access_token',
            access_token, {
            httpOnly: true,
            path: '/',
            maxAge: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
        }
        );
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
        });
        return { access_token, refreshToken }

    }

    async getUserIfRefreshTokenMatches(email: string, refreshToken: string): Promise<AccountRegister.Response> {
        return this.authService.send(AccountRefresh.compareTokens, { email, refreshToken }).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
    }

    async validateUser({ email, password }: AccountValidate.Request) {
        let data: AccountValidate.Request = { email, password }
        return this.authService.send(AccountValidate.topic, data).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        )
    }
}
