import { NestFactory } from '@nestjs/core';
import { MeetingModule } from './meeting.module';
import { Transport } from '@nestjs/microservices';

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
