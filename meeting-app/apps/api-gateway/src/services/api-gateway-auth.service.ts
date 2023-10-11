import { Inject, Injectable } from '@nestjs/common';

import { Response } from 'express';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { Observable, catchError, throwError } from 'rxjs';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.google-login';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';
import { AccountMarkEmailAsConfirmed } from 'libs/common/contracts/account/account.markEmailAsConfirmed';

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

    async login(dto: AccountLogin.Request, res: Response): Promise<AccountLogin.Response> {
        let { access_token, refreshToken } = await this.authService.send(AccountLogin.topic, dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        this.sendCookie(res, access_token, refreshToken);
        return { access_token, refreshToken }
    }

    async refresh(req: AccountRefresh.ReqWithUser, res: Response): Promise<AccountRefresh.Response> {
        let { access_token, refreshToken } = await this.authService.send(AccountRefresh.refreshCommand, req.user).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        this.sendCookie(res, access_token, refreshToken);
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

    async googleLogin(googlePayload: AccountGoogleLogin.Request, res: Response): Promise<AccountLogin.Response> {
        let { access_token, refreshToken } = await this.authService.send(AccountGoogleLogin.topic, googlePayload).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        this.sendCookie(res, access_token, refreshToken);
        return {
            access_token, refreshToken
        }
    }

    async getUserByEmail(email: AccountGetUserByEmail.Request): Promise<AccountRegister.Response> {
        return await this.authService.send(AccountGetUserByEmail.topic, email).toPromise()
    }

    async markEmailAsConfirmed(email: AccountMarkEmailAsConfirmed.Request): Promise<Observable<AccountMarkEmailAsConfirmed.Response>> {
        return await this.authService.send(AccountMarkEmailAsConfirmed.topic, email).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
    }

    async sendCookie(res: Response, access_token: string, refreshToken: string) {
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
    }
}
