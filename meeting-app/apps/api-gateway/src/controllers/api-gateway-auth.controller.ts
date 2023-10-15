import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';

import { Response } from 'express';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { Observable } from 'rxjs';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { LocalAuthGuard } from '../guards/local.guard';
import { RefreshGuard } from '../guards/refresh.guard';
import { GoogleOAuthGuard } from '../guards/google-oath.guard';
import { GetGooglePayload } from '../decorators/get-google-payload.decorator';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.google-login';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import ConfirmEmailDto from 'libs/common/contracts/account/interfaces/ConfirmEmailDto';
import { AccountRoleUpdate } from 'libs/common/contracts/account/account.roleUpdate';
import { Roles } from '../decorators/roles.decorator';
import { $Enums, Role } from '@prisma/client';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class ApiGatewayAuthController {

    constructor(private readonly apiGatewayAuthService: ApiGatewayAuthService,
        private readonly emailConfirmationService: EmailConfirmationService) { }

    @Post('register')
    async register(@Body() createUserDto: AccountRegister.Request): Promise<Observable<AccountRegister.Response>> {
        const user = this.apiGatewayAuthService.register(createUserDto);
        await this.emailConfirmationService.sendVerificationLink(createUserDto.email);
        return user;
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

    @Get('email/callback')
    async confirm(@Query() confirmationData: ConfirmEmailDto, @Res({ passthrough: true }) res: Response) {
        const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.acctoken);
        this.apiGatewayAuthService.sendCookie(res, confirmationData.acctoken, confirmationData.reftoken)
        return await this.emailConfirmationService.confirmEmail(email);
    }

    @Roles($Enums.Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('roleUpgrade')
    async roleUpdate(@Query() data: AccountRoleUpdate.Request): Promise<AccountRegister.Response> {
        return await this.apiGatewayAuthService.roleUpdate(data);
    }
}