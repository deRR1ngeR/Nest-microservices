import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal } from 'class-validator';

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
        @IsDecimal()
        longitude: Decimal;

        @ApiProperty()
        @IsDecimal()
        latitude: Decimal;
    }
}