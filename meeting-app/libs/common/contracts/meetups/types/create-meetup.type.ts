import { Meetup } from '@prisma/client';

export type CreateMeetupType = Omit<Meetup, 'id' | 'createdBy' | 'description'> & Partial<Pick<Meetup, 'description'>>;
