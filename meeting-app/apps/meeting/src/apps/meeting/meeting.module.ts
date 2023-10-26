import { Module } from '@nestjs/common';

import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { PrismaModule } from 'libs/common/database/prisma.module';
import { UserMeetupModule } from '../user-meetup/user-meetup.module';
import { MeetupsSearchModule } from '../meetups-search/meetups-search.module';


@Module({
  imports: [PrismaModule, UserMeetupModule, MeetupsSearchModule],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule { }