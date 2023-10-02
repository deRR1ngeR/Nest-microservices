import { Module } from '@nestjs/common';

import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { PrismaModule } from 'libs/common/database/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule { }
