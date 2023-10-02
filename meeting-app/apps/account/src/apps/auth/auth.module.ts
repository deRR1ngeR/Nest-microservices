import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'libs/common/database/prisma.module';
import { UsersModule } from '../users/src/users.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
