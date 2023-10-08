import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { MeetupCreate } from 'libs/common/contracts/meetups/meetup.create';
import { MeetupUpdate } from 'libs/common/contracts/meetups/update-meetup';
import { MeetupDelete } from 'libs/common/contracts/meetups/meetup.delete';

@Injectable()
export class MeetingService {
  constructor(private readonly db: PrismaService) { }

  async create(dto: MeetupCreate.Request): Promise<MeetupCreate.Response> {
    return await this.db.meetup.create({
      data: {
        ...dto,
        createdBy: 1
      }
    })
  }

  async findAll(): Promise<MeetupCreate.Response[]> {
    const result = await this.db.meetup.findMany();
    if (!result)
      throw new HttpException('Requested content not found', HttpStatus.NOT_FOUND)
    return result;
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
