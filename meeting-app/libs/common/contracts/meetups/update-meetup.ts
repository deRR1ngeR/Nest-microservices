import { ApiProperty, PartialType } from '@nestjs/swagger';

import { MeetupTypeResponse } from './types/response.meetup.type';
import { UpdateMeetupDto } from '../../../../apps/api-gateway/src/dtos/meetup/update-meetup.dto';
import { Decimal } from '@prisma/client/runtime/library';

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
        longitude: Decimal;

        @ApiProperty()
        latitude: Decimal;

        @ApiProperty()
        creatorId: number;
    }

}