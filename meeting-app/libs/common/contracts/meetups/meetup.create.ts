import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsArray, IsDateString, IsDecimal, IsNumber } from 'class-validator';

export namespace MeetupCreate {

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
        @IsNumber()
        longitude: Decimal;

        @ApiProperty()
        @IsNumber()
        latitude: Decimal;
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
    }
}