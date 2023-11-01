import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaModule } from 'libs/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule { }
