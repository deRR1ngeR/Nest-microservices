import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';

import { Response } from 'express';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { Observable } from 'rxjs';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { LocalAuthGuard } from '../guard/local.guard';
import { RefreshGuard } from '../guard/refresh.guard';
import { GoogleOAuthGuard } from '../guard/google-oath.guard';
import { GetGooglePayload } from '../decorators/get-google-payload.decorator';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.google-login';

@ApiTags('auth')
@Controller('auth')
export class ApiGatewayAuthController {

    constructor(private readonly apiGatewayAuthService: ApiGatewayAuthService) { }

    @Post('register')
    async register(@Body() createUserDto: AccountRegister.Request): Promise<Observable<AccountRegister.Response>> {
        return this.apiGatewayAuthService.register(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() dto: AccountLogin.Request,
        @Res({ passthrough: true }) res: Response): Promise<AccountLogin.Response> {
        return this.apiGatewayAuthService.login(dto, res);
    }

    @UseGuards(RefreshGuard)
    @Post('refresh')
    async refresh(@Req() req: AccountRefresh.ReqWithUser, @Res({ passthrough: true }) res: Response): Promise<AccountRefresh.Response> {
        return this.apiGatewayAuthService.refresh(req, res);
    }

    @Get('google/login')
    @UseGuards(GoogleOAuthGuard)
    async googleLogin() {
        return { msg: 'Google authentication' };
    }

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    handleRedirect(@GetGooglePayload() googlePayload: AccountGoogleLogin.Request, @Res({ passthrough: true }) res: Response) {
        return this.apiGatewayAuthService.googleLogin(googlePayload, res);
    }
}