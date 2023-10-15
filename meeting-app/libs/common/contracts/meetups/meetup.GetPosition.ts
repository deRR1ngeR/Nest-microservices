import { ApiProperty } from '@nestjs/swagger';

export namespace MeetupGetPosition {

    export class Request {
        @ApiProperty()
        lat: number;

        @ApiProperty()
        lon: number;
    }
}