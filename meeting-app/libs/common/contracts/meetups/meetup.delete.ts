import { ApiProperty } from '@nestjs/swagger';

export namespace MeetupDelete {

    export class Request {
        id: string;
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
        location: string;
    }
}