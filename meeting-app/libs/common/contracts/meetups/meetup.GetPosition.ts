import { ApiProperty } from '@nestjs/swagger';

export namespace MeetupGetPosition {
    export const topic = 'Meetup.GetPosition.Command';

    export class Request {
        @ApiProperty()
        lat: number;

        @ApiProperty()
        lon: number;
    }
}