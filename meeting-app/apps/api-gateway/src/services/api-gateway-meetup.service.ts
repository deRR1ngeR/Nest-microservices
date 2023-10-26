import { ForbiddenException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';
import { UpdateMeetupDto } from 'apps/api-gateway/src/dtos/meetup/update-meetup.dto';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { MeetupCommands } from 'libs/common/contracts/meetups/meetup.commands';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiGatewayAuthService } from './api-gateway-auth.service';
import { RequestWithUser } from 'libs/common/contracts/account/interfaces/request-with-user.interface';
import { MeetupFindUserMeetups } from 'libs/common/contracts/meetup.findUserMeetups';
import { stringify } from 'csv-stringify';
import { pdfGenerator } from '../utils/pdf-generator'
import { MeetupSearch } from 'libs/common/contracts/meetups/meetups.search';
import { CreateMeetupDto } from '../dtos/meetup/create-meetup.dto';


@Injectable()
export class ApiGatewayMeetupService {
  constructor(@Inject('MEETING_SERVICE') private readonly meetingService: ClientProxy,
    private readonly apiGateWayAuthService: ApiGatewayAuthService) { }

  async create(data: CreateMeetupDto, id: number): Promise<Observable<MeetupCreate.Response>> {
    let meetup = await this.meetingService.send(MeetupCommands.meetupCreate, { data, id }).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();

    await this.meetingService.send(MeetupCommands.meetupInviteUsers, { meetupId: meetup.id, userId: id }).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();;
    return meetup;
  }

  async findAll(position: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {
    return await this.meetingService.send(MeetupCommands.meetupGetAll, position).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();
  }

  async findById(id: number): Promise<MeetupCreate.Response> {
    let res = await this.meetingService.send(MeetupCommands.meetupGetById, id).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();
    return res;
  };


  async delete(id: number): Promise<Observable<MeetupDelete.Response>> {
    return this.meetingService.send(MeetupCommands.meetupDelete, id);
  }

  async update(id: number, dto: UpdateMeetupDto, userId: number): Promise<Observable<MeetupUpdate.Response>> {
    const { creatorId } = await this.findById(id);

    if (creatorId == userId)
      return this.meetingService.send(MeetupCommands.meetupUpdate, { id: id, data: dto });
    else throw new ForbiddenException('Acces closed');
  }

  async inviteUsers(meetupId: number, email: AccountGetUserByEmail.Request, id: number) {
    const creatorId = (await this.findById(meetupId)).creatorId;
    if (id == creatorId) {
      const user = (await this.apiGateWayAuthService.getUserByEmail(email));
      console.log(user)
      if (!user)
        throw new RpcException(new NotFoundException('No user with such email'))
      return await this.meetingService.send(MeetupCommands.meetupInviteUsers, { meetupId, userId: user.id }).pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)))
      ).toPromise();
    }
    else {
      throw new RpcException(new ForbiddenException('No access'))
    }
  }

  async deleteUserFromMeetup(meetupId: number, email: AccountGetUserByEmail.Request, id: number) {

    const creatorId = (await this.findById(meetupId)).creatorId;

    if (id == creatorId) {
      const user = (await this.apiGateWayAuthService.getUserByEmail(email));
      console.log(user)
      if (!user)
        throw new RpcException(new NotFoundException('No user with such email'))

      return await this.meetingService.send(MeetupCommands.meetupDeleteUser, { meetupId, userId: user.id }).pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)))
      ).toPromise();
    }
    else {
      throw new RpcException(new ForbiddenException('No access'))
    }
  }

  async findUserMeetups(userId: number): Promise<MeetupFindUserMeetups.Response> {
    return await this.meetingService.send(MeetupCommands.meetupFindUserMeetup, userId).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();
  }

  async generateCsv(userId: number) {
    let meetups = await this.meetingService.send(MeetupCommands.meetupFindUserMeetup, userId).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();

    const meetupObjects = meetups.map((item) => item.meetup);

    const result = stringify(meetupObjects, { header: true, delimiter: ';' });

    return result;
  }

  async generatePdf(): Promise<Buffer> {
    let meetups = await this.meetingService.send(MeetupCommands.meetupGetAll, {}).pipe(
      catchError((error) =>
        throwError(() => new RpcException(error.response)))
    ).toPromise();

    return await pdfGenerator(meetups);

  }

  async findMeetupsWithElastic(
    searchDto: MeetupSearch.MeetupSearchDto,
  ): Promise<Observable<MeetupSearch.Response[]>> {
    return this.meetingService.send(
      MeetupSearch.findAllMeetupsElasticTopic,
      searchDto,
    );
  }
}
