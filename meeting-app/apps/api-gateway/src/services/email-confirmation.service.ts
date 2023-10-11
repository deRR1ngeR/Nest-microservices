import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ITokenPayload from 'libs/common/contracts/account/interfaces/token-payload.interface';
import EmailService from './email.service';
import { ApiGatewayAuthService } from './api-gateway-auth.service';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly apiGatewayAuthService: ApiGatewayAuthService
    ) { }

    sendVerificationLink(email: string) {
        const payload: ITokenPayload = { email };
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN'),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });

        const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?acctoken=${access_token}&reftoken=${refreshToken}`;

        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

        this.emailService.sendMail({
            to: email,
            subject: 'Email confirmation',
            text,
        })

    }

    async confirmEmail(email: AccountGetUserByEmail.Request) {
        const user = await this.apiGatewayAuthService.getUserByEmail(email);
        if (user.isEmailConfirmed) {
            throw new BadRequestException('Email already confirmed');
        }
        return await this.apiGatewayAuthService.markEmailAsConfirmed(email);
    }

    async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            });

            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }
}