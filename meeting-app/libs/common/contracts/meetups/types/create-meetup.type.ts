import { Meetup } from '@prisma/client';

export type CreateMeetupType = Omit<Meetup, 'id' | 'creatorId' | 'description'> & Partial<Pick<Meetup, 'description'>>;
