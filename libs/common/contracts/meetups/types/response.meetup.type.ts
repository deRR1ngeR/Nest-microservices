import { Meetup } from '@prisma/client';

export type MeetupTypeResponse = Omit<Meetup, 'creatorId' | 'description'> & Partial<Pick<Meetup, 'description'>>;
