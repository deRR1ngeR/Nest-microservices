import { Controller, Get, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/contracts/users/dtos/create-user.dto';
import RequestWithUser from 'libs/common/contracts/users/requests/requset-with-user.interface';
import { LoginResponse } from 'libs/common/contracts/users/responses/login.response';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('register')
  async register(@Payload() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  @MessagePattern('login')
  async login(@Payload() data: RequestWithUser): Promise<LoginResponse> {
    return this.authService.login(data)
  }
}
