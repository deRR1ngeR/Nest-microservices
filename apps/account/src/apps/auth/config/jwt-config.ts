import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        global: true
    }),
});