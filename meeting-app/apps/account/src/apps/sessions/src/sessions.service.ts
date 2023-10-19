import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'libs/common/database/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly db: PrismaService) { }

  async createOrUpdateSession(userId: number, refreshToken: string): Promise<void> {
    await this.db.session.upsert({
      where: {
        userId
      },
      create: {
        userId,
        refreshToken
      },
      update: {
        refreshToken
      }
    })
  }

  async getRefreshToken(userId: number) {
    return this.db.session.findUnique({
      where: {
        userId
      }
    })
  }

  async logout(userId: number) {
    try {
      return await this.db.session.delete({
        where: {
          userId
        }
      })
    }
    catch (err) {
      throw new RpcException(new NotFoundException('session was not found'))
    }

  }
}
