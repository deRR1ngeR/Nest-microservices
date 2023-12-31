import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UpdateMeetupDto } from 'apps/api-gateway/src/dtos/meetup/update-meetup.dto';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';
import * as geolib from 'geolib';
import { MeetupGetPosition } from 'libs/common/contracts/meetups/meetup.GetPosition';
import { MeetupSearch } from 'libs/common/contracts/meetups/meetups.search';
import { MeetupsSearchService } from '../meetups-search/meetups-search.service';
import { CreateMeetupDto } from 'apps/api-gateway/src/dtos/meetup/create-meetup.dto';

@Injectable()
export class MeetingService {
  constructor(private readonly db: PrismaService,
    private readonly meetupsSearchService: MeetupsSearchService) { }

  async create(data: CreateMeetupDto, id: number) {
    return await this.db.meetup.create({
      data: {
        ...data,
        creatorId: id
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

  async findAllMeetupsElastic(searchDto: MeetupSearch.MeetupSearchDto) {
    return this.meetupsSearchService.search(searchDto.query);
  }
}
