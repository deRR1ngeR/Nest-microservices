import { ApiProperty } from '@nestjs/swagger';
import { Meetup } from '@prisma/client'

type MeetupTypeResponse = Omit<Meetup, 'createdBy' | 'description'> & Partial<Pick<Meetup, 'description'>>;


export class MeetupResponse implements MeetupTypeResponse {
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