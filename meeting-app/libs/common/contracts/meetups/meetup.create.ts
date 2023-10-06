import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export namespace MeetupCreate {
    export const topic = 'Meetup.Create.Command';

    export class Request {
        @ApiProperty()
        @IsString()
        name: string;

        @ApiProperty({
            required: false
        })
        @IsOptional()
        @IsString()
        description?: string;

        @ApiProperty()
        @IsArray()
        tags: string[];

        @ApiProperty()
        @IsDateString()
        date: Date;

        @ApiProperty()
        @IsString()
        location: string;
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