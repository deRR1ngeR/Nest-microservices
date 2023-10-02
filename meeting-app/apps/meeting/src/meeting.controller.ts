import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

import { MeetingService } from './meeting.service';
import { UpdateMeetupRequest } from '../../../libs/common/contracts/meetups/requests/update-meetup.request';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) { }

  @MessagePattern('createMeetup')
  async create(@Payload() data: CreateMeetupDto, @Ctx() context: RmqContext) {
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
  async update(@Payload() data: UpdateMeetupRequest, @Ctx() context: RmqContext) {
    const id = data.id;
    delete data.id;
    const result = await this.meetingService.update(+id, data.data);

    if (!result)
      throw new HttpException('Requested content not found', HttpStatus.NOT_FOUND)
    return result;
  }
}
