import { PartialType } from '@nestjs/swagger';
import { MeetupCreate } from '../meetup.create';

export class UpdateMeetupDto extends PartialType(MeetupCreate.Request) { }