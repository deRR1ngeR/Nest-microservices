import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';

import { Response } from 'express';
import { AccounLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { Observable } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class ApiGatewayAuthController {

    constructor(private readonly apiGatewayAuthService: ApiGatewayAuthService) { }

    @Post('register')
    async register(@Body() createUserDto: AccountRegister.Request): Promise<Observable<AccountRegister.Response>> {
        return this.apiGatewayAuthService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() dto: AccounLogin.Request,
        @Res({ passthrough: true }) res: Response): Promise<AccounLogin.Response> {
        return this.apiGatewayAuthService.login(dto, res);
    }

}