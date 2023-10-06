import { Meetup } from '@prisma/client';

export type MeetupTypeResponse = Omit<Meetup, 'createdBy' | 'description'> & Partial<Pick<Meetup, 'description'>>;
