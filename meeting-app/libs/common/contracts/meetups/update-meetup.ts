import { ApiProperty, PartialType } from '@nestjs/swagger';

import { MeetupCreate } from './meetup.create';
import { MeetupTypeResponse } from './types/response.meetup.type';
import { UpdateMeetupDto } from './dtos/update-meetup.dto';

export namespace MeetupUpdate {

    export class Request {
        @ApiProperty()
        id: number;

        @ApiProperty()
        data: UpdateMeetupDto
    }

    export class Response implements MeetupTypeResponse {
        @ApiProperty()
        id: number;

        @ApiProperty()
        name: string;

        @ApiProperty({
            required: false
        })
        description?: string;

        @ApiProperty()
        tags: string[];

        @ApiProperty()
        date: Date;

        @ApiProperty()
        location: string;
    }

}