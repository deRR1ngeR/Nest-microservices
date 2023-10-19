import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MeetingModule } from './apps/meeting/meeting.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MeetingModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'meeting_queue',
        queueOptions: {
          durable: false
        }
      }
    });
  await app.listen();
}
bootstrap();