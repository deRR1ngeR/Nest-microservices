import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'libs/common/database/prisma.service';
import { CreateMeetupDto } from 'libs/common/contracts/meetups/dtos/create-meetup.dto';
import { UpdateMeetupDto } from 'libs/common/contracts/meetups/dtos/update-meetup.dto';
import { MeetupResponse } from 'libs/common/contracts/meetups/responses/meetup.response';

@Injectable()
export class MeetingService {
  constructor(private readonly db: PrismaService) { }

  async create(dto: CreateMeetupDto): Promise<MeetupResponse> {
    return await this.db.meetup.create({
      data: {
        ...dto,
        createdBy: 1
      }
    })
  }

  async findAll() {
    const result = await this.db.meetup.findMany();
    if (!result)
      throw new HttpException('Requested content not found', HttpStatus.NOT_FOUND)
    return result;
  }

  async findById(id: number): Promise<MeetupResponse> {
    return await this.db.meetup.findUnique({
      where: {
        id: id
      }
    }
    );
  }

  async update(id: number, dto: UpdateMeetupDto): Promise<MeetupResponse> {
    try {
      console.log(dto)
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

  async delete(id: number): Promise<MeetupResponse> {
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
