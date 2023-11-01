import { ApiProperty } from '@nestjs/swagger';

export namespace MeetupInviteUsers {

    export class Request {
        meetupId: number;
        userId: number;
    }
}