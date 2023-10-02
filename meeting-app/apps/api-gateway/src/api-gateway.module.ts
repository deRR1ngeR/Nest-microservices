import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ApiGatewayMeetupController } from './controllers/api-gateway-meetup.controller';
import { ApiGatewayMeetupService } from './services/api-gateway-meetup.service';
import { ApiGatewayAuthController } from './controllers/api-gateway-auth.controller';
import { ApiGatewayAuthService } from './services/api-gateway-auth.service';

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
    ])
  ],
  controllers: [ApiGatewayMeetupController, ApiGatewayAuthController],
  providers: [ApiGatewayMeetupService, ApiGatewayAuthService],
})
export class ApiGatewayModule { }
