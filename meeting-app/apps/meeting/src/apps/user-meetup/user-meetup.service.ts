import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MeetupInviteUsers } from 'libs/common/contracts/meetups/meetup.inviteUsers';
import { PrismaService } from 'libs/common/database/prisma.service';

@Injectable()
export class UserMeetupService {
  constructor(private readonly db: PrismaService) { }



  async addUserToMeetup(data: MeetupInviteUsers.Request) {
    console.log(data);
    try {
      return await this.db.userMeetup.create({
        data: {
          meetupId: +data.meetupId,
          userId: data.userId
        }
      })
    }
    catch (err) {
      throw new RpcException(new ForbiddenException('Error while user inviting'))
    }
  }

  async deleteUserFromMeetup(data: MeetupInviteUsers.Request) {
    try {
      return await this.db.userMeetup.delete({
        where: {
          userId_meetupId: {
            userId: data.userId,
            meetupId: +data.meetupId
          }
        }
      })
    }
    catch (err) {
      throw new RpcException(new NotFoundException('User or meetup was not found'))
    }
  }

  async findUserMeetups(userId: number) {
    console.log(userId)
    try {
      return await this.db.userMeetup.findMany({
        include: {
          meetup: true
        },
        where: {
          userId
        }
      })
    }
    catch (err) {
      throw new RpcException(new NotFoundException('Unvalid request'))
    }
  }


}
