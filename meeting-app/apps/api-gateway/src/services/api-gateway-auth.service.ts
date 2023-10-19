import { Inject, Injectable } from '@nestjs/common';

import { Response } from 'express';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { Observable, catchError, throwError } from 'rxjs';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.googleLogin';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';
import { AccountMarkEmailAsConfirmed } from 'libs/common/contracts/account/account.markEmailAsConfirmed';
import { AccountRoleUpdate } from 'libs/common/contracts/account/account.roleUpdate';
import { AccountLogout } from 'libs/common/contracts/account/account.logout';
import { AwsService } from '../utils/google-storage';
import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';
import { AccountAvatarUpdate } from 'libs/common/contracts/account/account.avatarUpdate';

@Injectable()
export class ApiGatewayAuthService {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
        private readonly configService: ConfigService,
        private readonly awsService: AwsService) { }

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

    async getUserByEmail(data: AccountGetUserByEmail.Request): Promise<AccountRegister.Response> {
        return await this.authService.send(AccountGetUserByEmail.topic, data.email).toPromise()
    }

    async markEmailAsConfirmed(email: AccountMarkEmailAsConfirmed.Request): Promise<Observable<AccountMarkEmailAsConfirmed.Response>> {
        return await this.authService.send(AccountMarkEmailAsConfirmed.topic, email).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
    }

    async roleUpdate(email: AccountRoleUpdate.Request): Promise<AccountRegister.Response> {
        return await this.authService.send(AccountRoleUpdate.topic, email).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
    }

    async logout(userId: number, res: Response) {
        res.cookie('access_token', '', { expires: new Date(0) })
        res.cookie('refresh_token', '', { expires: new Date(0) })
        return await this.authService.send(AccountLogout.topic, { userId }).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
    }

    async avatarUpload(file: Express.Multer.File, res: Response, userId: number) {
        const result = this.awsService.upload(file, res);
        if (result.statusCode == 201) {
            await this.authService.send(AccountAvatarUpdate.topic, { userId, fileName: file.originalname })
        }
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
