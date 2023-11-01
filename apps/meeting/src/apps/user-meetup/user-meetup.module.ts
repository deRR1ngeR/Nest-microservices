import { Module } from '@nestjs/common';
import { UserMeetupService } from './user-meetup.service';
import { PrismaModule } from 'libs/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [UserMeetupService],
  exports: [UserMeetupService]
})
export class UserMeetupModule { }
