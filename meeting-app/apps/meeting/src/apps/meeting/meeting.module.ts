import { Module } from '@nestjs/common';

import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { PrismaModule } from 'libs/common/database/prisma.module';
import { UserMeetupModule } from '../user-meetup/user-meetup.module';


@Module({
  imports: [PrismaModule, UserMeetupModule],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule { }