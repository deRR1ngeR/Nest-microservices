import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';

import { Response } from 'express';

import { $Enums } from '@prisma/client';

import { Observable } from 'rxjs';

import { GoogleOAuthGuard } from '../guards/google-oath.guard';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.googleLogin';
import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRoleUpdate } from 'libs/common/contracts/account/account.roleUpdate';
import ConfirmEmailDto from 'libs/common/contracts/account/interfaces/ConfirmEmailDto';
import { GetGooglePayload } from '../decorators/get-google-payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LocalAuthGuard } from '../guards/local.guard';
import { RefreshGuard } from '../guards/refresh.guard';
import { RolesGuard } from '../guards/roles.guard';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { RequestWithUser } from 'libs/common/contracts/account/interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Get('roleUpdate')
    async roleUpdate(@Query() data: AccountRoleUpdate.Request): Promise<AccountRegister.Response> {
        return await this.apiGatewayAuthService.roleUpdate(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Req() req: RequestWithUser, @Res() res: Response) {
        await this.apiGatewayAuthService.logout(req.user.id, res);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('avatar/upload')
    async avatarUpload(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res: Response, @Req() req: RequestWithUser) {
        return await this.apiGatewayAuthService.avatarUpload(file, res, +req.user.email);
    }
}