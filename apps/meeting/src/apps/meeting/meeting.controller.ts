import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { MeetingService } from './meeting.service';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupCommands } from 'libs/common/contracts/meetups/meetup.commands';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { UserMeetupService } from '../user-meetup/user-meetup.service';
import { MeetupInviteUsers } from 'libs/common/contracts/meetups/meetup.inviteUsers';
import { MeetupFindUserMeetups } from 'libs/common/contracts/meetup.findUserMeetups';
import { MeetupSearch } from 'libs/common/contracts/meetups/meetups.search';
import { MeetupsSearchService } from '../meetups-search/meetups-search.service';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService,
    private readonly userMeetupService: UserMeetupService,
    private readonly meetupSearchModule: MeetupsSearchService) { }

  @MessagePattern(MeetupCommands.meetupCreate)
  async create(@Payload() data: MeetupCreate.Request): Promise<MeetupCreate.Response> {
    const meetup = await this.meetingService.create(data.data, data.id);
    await this.meetupSearchModule.indexMeetup(meetup);
    return meetup;

  }

  @MessagePattern(MeetupCommands.meetupGetAll)
  async findAll(@Payload() data: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {
    let res = await this.meetingService.findAll(data);
    return res;
  }

  @MessagePattern(MeetupCommands.meetupGetById)
  async findById(@Payload() data: number) {
    let result = await this.meetingService.findById(data);
    if (result)
      return result;
    else throw new RpcException(new NotFoundException('Requested content not found'));
  }

  @MessagePattern(MeetupCommands.meetupDelete)
  async delete(@Payload() data: MeetupDelete.Request) {
    let result = await this.meetingService.delete(+data);
    if (result) {
      this.meetupSearchModule.removeIndex(+data);
      return result
    }
    else throw new RpcException(new NotFoundException('Requested content not found'))
  }

  @MessagePattern(MeetupCommands.meetupUpdate)
  async update(@Payload() data: MeetupUpdate.Request) {
    const id = data.id;
    delete data.id;
    const result = await this.meetingService.update(id, data.data);

    if (!result)
      throw new RpcException(new NotFoundException('Requested content not found'))

    this.meetupSearchModule.updateIndexMeetup(result)
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
  async findUserMeetups(@Payload() id: number): Promise<MeetupFindUserMeetups.Response[]> {
    return await this.userMeetupService.findUserMeetups(id);
  }

  @MessagePattern(MeetupSearch.findAllMeetupsElasticTopic)
  async findAllMeetupsElastic(
    @Payload() searchDto: MeetupSearch.MeetupSearchDto,
  ) {
    return this.meetingService.findAllMeetupsElastic(searchDto);
  }

}
