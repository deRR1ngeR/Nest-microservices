import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import * as geolib from 'geolib';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';

@Injectable()
export class MeetingService {
  constructor(private readonly db: PrismaService) { }

  async create(dto: MeetupCreate.Request) {
    return await this.db.meetup.create({
      data: {
        ...dto,
        creatorId: 1
      }
    })
  }

  async findAll(position: MeetupGetPosition.Request): Promise<MeetupCreate.Response[]> {

    const meetups = await this.db.meetup.findMany();
    if (!meetups)
      throw new HttpException('Requested content not found', HttpStatus.NOT_FOUND)

    if (Object.keys(position).length != 0) {
      const { lat, lon } = position;

      const locationsInRadius = meetups.filter(meetup => {
        const distance = geolib.getDistance({ lat, lon }, { latitude: Number(meetup.latitude), longitude: Number(meetup.longitude) });
        return distance <= 100000; // 100 км в метрах
      });
      return locationsInRadius;
    }

    return meetups;
  }

  async findById(id: number): Promise<MeetupCreate.Response> {
    return await this.db.meetup.findUnique({
      where: {
        id: id
      }
    }
    );
  }

  async update(id: number, dto: UpdateMeetupDto): Promise<MeetupUpdate.Response> {
    try {
      return await this.db.meetup.update({
        where: {
          id: id
        },
        data: {
          ...dto
        }

      })
    }
    catch (err) {
      return
    }
  }

  async delete(id: number): Promise<MeetupDelete.Response> {
    try {
      return await this.db.meetup.delete({
        where: {
          id: id
        }
      })

    }
    catch (err) {
      return
    }
  }
}
