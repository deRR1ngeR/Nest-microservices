import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'libs/common/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './config/jwt-config';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/src/sessions.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    PassportModule,
    JwtModule.registerAsync(getJWTConfig()),
    SessionsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
