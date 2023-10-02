import { ApiProperty } from '@nestjs/swagger';

import { Meetup } from '@prisma/client';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

type CreateMeetupType = Omit<Meetup, 'id' | 'createdBy' | 'description'> & Partial<Pick<Meetup, 'description'>>;

export class CreateMeetupDto implements CreateMeetupType {
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