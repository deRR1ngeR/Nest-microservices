import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateMeetupDto } from 'apps/api-gateway/src/dtos/meetup/create-meetup.dto';

export namespace MeetupCreate {

    export class Request {

        id: number;

        data: CreateMeetupDto;

    }

    export class Response {
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