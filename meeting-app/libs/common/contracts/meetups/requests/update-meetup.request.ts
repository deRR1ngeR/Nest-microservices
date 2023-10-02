import { ApiProperty, PartialType } from '@nestjs/swagger';

import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';


export class UpdateMeetupRequest {

    @ApiProperty()
    id: number;

    @ApiProperty()
    data: UpdateMeetupDto
}