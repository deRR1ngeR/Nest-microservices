import { ApiProperty } from '@nestjs/swagger';

export namespace MeetupFindUserMeetups {
    export class Request {
        userId: number;
    }

    export class Response {

        @ApiProperty()
        userId: number;

        @ApiProperty()
        meetupId: number;

    }

}