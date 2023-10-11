import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ApiGatewayMeetupController } from './controllers/api-gateway-meetup.controller';
import { ApiGatewayMeetupService } from './services/api-gateway-meetup.service';
import { ApiGatewayAuthController } from './controllers/api-gateway-auth.controller';
import { ApiGatewayAuthService } from './services/api-gateway-auth.service';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { EmailConfirmationService } from './services/email-confirmation.service';
import EmailService from './services/email.service';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'apps/account/src/apps/auth/config/jwt-config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false
          }
        }
      }, {
        name: 'MEETING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'meeting_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]), ConfigModule.forRoot({
      expandVariables: true,
    }),
    JwtModule.registerAsync(getJWTConfig()),

  ],
  controllers: [ApiGatewayMeetupController, ApiGatewayAuthController],
  providers: [ApiGatewayMeetupService,
    ApiGatewayAuthService,
    JwtAuthStrategy,
    LocalStrategy,
    RefreshStrategy,
    GoogleStrategy,
    EmailConfirmationService,
    EmailService],
  exports: [ApiGatewayAuthService]
})
export class ApiGatewayModule { }

