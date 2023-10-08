import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('register')
  async register(@Payload() data: AccountRegister.Request) {
    return await this.authService.register(data);
  }

  @MessagePattern(AccountLogin.topic)
  async login(@Payload() data: AccountLogin.Request): Promise<AccountLogin.Response> {
    return this.authService.login(data);
  }

  @MessagePattern(AccountRefresh.refreshCommand)
  async refresh(@Payload() req: User): Promise<AccountRefresh.Response> {
    return await this.authService.refresh(req);
  }

  @MessagePattern(AccountRefresh.compareTokens)
  async getUserIfRefreshTokenMatches(@Payload() { email, refreshToken }) {

    return await this.authService.getUserIfRefreshTokenMatches(email, refreshToken)
  }

  @MessagePattern(AccountValidate.topic)
  async validateUser(@Payload() data: AccountValidate.Request) {
    return await this.authService.validateUser(data)
  }

}
