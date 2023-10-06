import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalAuthGuard } from './guard/local.guard';
import { AccounLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('register')
  async register(@Payload() data: AccountRegister.Request) {
    return await this.authService.register(data);
  }

  @MessagePattern(AccounLogin.topic)
  async login(@Payload() data: AccounLogin.Request): Promise<AccounLogin.Response> {
    console.log(data);
    return this.authService.login(data);
  }

}
