import { Controller, NotFoundException } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { MeetingService } from './meeting.service';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupCommands } from 'libs/common/contracts/meetups/meetup.commands';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { UserMeetupService } from '../user-meetup/user-meetup.service';
import { MeetupInviteUsers } from 'libs/common/contracts/meetups/meetup.inviteUsers';
import { MeetupFindUserMeetups } from 'libs/common/contracts/meetup.findUserMeetups';
import { MeetupGenerateCsv } from 'libs/common/contracts/meetups/meetup.generateCsv';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService,
    private readonly userMeetupService: UserMeetupService) { }

  @MessagePattern(MeetupCommands.meetupCreate)
  async create(@Payload() data: MeetupCreate.Request): Promise<MeetupCreate.Response> {
    return await this.meetingService.create(data.data, data.id);
  }

  @MessagePattern(MeetupCommands.meetupGetAll)
  async findAll(@Payload() data: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {
    return await this.meetingService.findAll(data);
  }

  @MessagePattern(MeetupCommands.meetupGetById)
  async findById(@Payload() data: string) {
    let result = await this.meetingService.findById(+data);
    if (result)
      return result;
    else throw new RpcException(new NotFoundException('Requested content not found'));
  }

  @MessagePattern(MeetupCommands.meetupDelete)
  async delete(@Payload() data: MeetupDelete.Request) {
    let result = await this.meetingService.delete(+data);
    if (result)
      return result
    else throw new RpcException(new NotFoundException('Requested content not found'))
  }

  @MessagePattern(MeetupCommands.meetupUpdate)
  async update(@Payload() data: MeetupUpdate.Request) {
    const id = data.id;
    delete data.id;
    const result = await this.meetingService.update(+id, data.data);

    if (!result)
      throw new RpcException(new NotFoundException('Requested content not found'))
    return result;
  }

  @MessagePattern(MeetupCommands.meetupInviteUsers)
  async inviteUser(@Payload() data: MeetupInviteUsers.Request) {
    return await this.userMeetupService.addUserToMeetup(data)
  }

  @MessagePattern(MeetupCommands.meetupDeleteUser)
  async deleteUserFromMeetup(@Payload() data: MeetupInviteUsers.Request) {
    return await this.userMeetupService.deleteUserFromMeetup(data);
  }

  @MessagePattern(MeetupCommands.meetupFindUserMeetup)
  async findUserMeetups(@Payload() data: MeetupFindUserMeetups.Request): Promise<MeetupFindUserMeetups.Response[]> {
    return await this.userMeetupService.findUserMeetups(data.userId);
  }
}
