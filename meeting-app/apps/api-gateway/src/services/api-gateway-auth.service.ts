import { Inject, Injectable } from '@nestjs/common';

import { Response } from 'express';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { Observable, catchError, throwError } from 'rxjs';
import { AccounLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';

@Injectable()
export class ApiGatewayAuthService {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

    register(dto: AccountRegister.Request): Observable<AccountRegister.Response> {
        return this.authService.send('register', dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)),
            ),
        );;
    }

    async login(dto: AccounLogin.Request, res: Response): Promise<AccounLogin.Response> {
        let access_token = await this.authService.send(AccounLogin.topic, dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)))
        ).toPromise();
        console.log(access_token)
        res.cookie(
            'access_token',
            access_token
        )
        return access_token;
    }
}
