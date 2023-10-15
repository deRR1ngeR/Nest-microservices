import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsArray, IsDateString, IsNumber } from 'class-validator';
import { CreateMeetupDto } from './dtos/create-meetup.dto';

export namespace MeetupCreate {

    export class Request {

        @ApiProperty()
        id: number;

        @ApiProperty()
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