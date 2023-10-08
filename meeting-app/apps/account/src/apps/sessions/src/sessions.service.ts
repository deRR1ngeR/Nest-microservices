import { Injectable } from '@nestjs/common';
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
}
