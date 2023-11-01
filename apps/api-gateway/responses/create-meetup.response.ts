import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDate, IsString } from 'class-validator';

export class CreateMeetupResponse {
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