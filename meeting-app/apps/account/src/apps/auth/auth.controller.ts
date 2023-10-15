import { Controller, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { AccountLogin } from 'libs/common/contracts/account/account.login';
import { AccountRegister } from 'libs/common/contracts/account/account.register';
import { AccountRefresh } from 'libs/common/contracts/account/account.refresh';
import { AccountValidate } from 'libs/common/contracts/account/account.validate';
import { Role, User } from '@prisma/client';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.google-login';
import { AccountGetUserByEmail } from 'libs/common/contracts/account/account.getUserByEmail';
import { UsersService } from '../users/users.service';
import { AccountMarkEmailAsConfirmed } from 'libs/common/contracts/account/account.markEmailAsConfirmed';
import { AccountRoleUpdate } from 'libs/common/contracts/account/account.roleUpdate';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UsersService) { }

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

  @MessagePattern(AccountGoogleLogin.topic)
  async googleLogin(@Payload() data: AccountGoogleLogin.Request) {
    return await this.authService.googleLogin(data);
  }

  @MessagePattern(AccountGetUserByEmail.topic)
  async getUserByEmail(@Payload() email: string) {
    return await this.userService.findUserByEmail(email)
  }

  @MessagePattern(AccountMarkEmailAsConfirmed.topic)
  async markEmailAsConfirmed(@Payload() data: AccountMarkEmailAsConfirmed.Request) {
    return await this.userService.markEmailAsConfirmed(data);
  }

  @MessagePattern(AccountRoleUpdate.topic)
  async roleUpdate(@Payload() data: AccountRoleUpdate.Request): Promise<AccountRegister.Response> {
    const user = await this.userService.findUserByEmail(data.email);
    if (user.role != Role.USER) {
      throw new RpcException(new ForbiddenException('This user already has the organizer role'))
    }
    return await this.userService.roleUpdate(data.email);
  }
}
