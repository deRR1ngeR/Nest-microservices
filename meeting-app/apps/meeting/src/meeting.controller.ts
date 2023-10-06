import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

import { MeetingService } from './meeting.service';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) { }

  @MessagePattern(MeetupCreate.topic)
  async create(@Payload() data: MeetupCreate.Request): Promise<MeetupCreate.Response> {
    return await this.meetingService.create(data);
  }

  @MessagePattern('findAllMeetups')
  async findAll() {
    return await this.meetingService.findAll();
  }

  @MessagePattern('findMeetupById')
  async findById(@Payload() data: string, @Ctx() context: RmqContext) {
    return await this.meetingService.findById(+data);
  }

  @MessagePattern('deleteMeetup')
  async delete(@Payload() data: string, @Ctx() context: RmqContext) {
    let result = await this.meetingService.delete(+data);
    if (result)
      return result
    else throw new HttpException('Cant delete', HttpStatus.NOT_FOUND)
  }

  @MessagePattern('updateMeetup')
  async update(@Payload() data: MeetupUpdate.Request, @Ctx() context: RmqContext) {
    const id = data.id;
    delete data.id;
    const result = await this.meetingService.update(+id, data.data);

    if (!result)
      throw new HttpException('Requested content not found', HttpStatus.NOT_FOUND)
    return result;
  }
}
