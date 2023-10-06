import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { Observable } from 'rxjs';


@Injectable()
export class ApiGatewayMeetupService {
  constructor(@Inject('MEETING_SERVICE') private readonly meetingService: ClientProxy) { }

  async create(dto: MeetupCreate.Request): Promise<Observable<MeetupCreate.Response>> {
    return this.meetingService.send(MeetupCreate.topic, dto);
  }

  async findAll() {
    return this.meetingService.send('findAllMeetups', {})
  }

  async findById(id: string) {
    return this.meetingService.send('findMeetupById', id);
  }

  async delete(id: string) {
    return this.meetingService.send('deleteMeetup', id);
  }

  async update(id: string, dto: UpdateMeetupDto): Promise<Observable<MeetupUpdate.Response>> {
    return this.meetingService.send('updateMeetup', { id: id, data: dto });
  }
}
