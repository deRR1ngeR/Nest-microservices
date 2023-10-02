import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';


@Injectable()
export class ApiGatewayMeetupService {
  constructor(@Inject('MEETING_SERVICE') private readonly meetingService: ClientProxy) { }

  create(dto: CreateMeetupDto) {
    return this.meetingService.send('createMeetup', dto);
  }

  findAll() {
    return this.meetingService.send('findAllMeetups', {})
  }

  findById(id: string) {
    return this.meetingService.send('findMeetupById', id);
  }

  delete(id: string) {
    return this.meetingService.send('deleteMeetup', id);
  }

  update(id: string, dto: UpdateMeetupDto) {
    return this.meetingService.send('updateMeetup', { id: id, data: dto });
  }
}
