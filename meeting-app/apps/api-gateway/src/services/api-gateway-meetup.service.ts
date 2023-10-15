import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { MeetupCommands } from 'libs/common/contracts/meetups/meetup.commands';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { Observable } from 'rxjs';


@Injectable()
export class ApiGatewayMeetupService {
  constructor(@Inject('MEETING_SERVICE') private readonly meetingService: ClientProxy) { }

  async create(data: CreateMeetupDto, id: number): Promise<Observable<MeetupCreate.Response>> {
    return this.meetingService.send(MeetupCommands.meetupCreate, { data, id });
  }

  async findAll(position: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {
    return await this.meetingService.send(MeetupCommands.meetupGetAll, position).toPromise()
  }

  async findById(id: string) {
    return this.meetingService.send(MeetupCommands.meetupGetById, id);
  }

  async delete(id: MeetupDelete.Request): Promise<Observable<MeetupDelete.Response>> {
    return this.meetingService.send(MeetupCommands.meetupDelete, id);
  }

  async update(id: string, dto: UpdateMeetupDto): Promise<Observable<MeetupUpdate.Response>> {
    return this.meetingService.send(MeetupCommands.meetupUpdate, { id: id, data: dto });
  }
}
