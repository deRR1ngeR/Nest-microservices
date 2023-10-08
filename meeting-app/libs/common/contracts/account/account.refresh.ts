import { ApiProperty } from '@nestjs/swagger';

import { AccountRegister } from './account.register';

export namespace AccountRefresh {

    export const compareTokens = 'Account.RefreshToken.Command';
    export const refreshCommand = 'Account.GetUserIfRefreshTokenMatches.Command';

    export class ReqWithToken {
        @ApiProperty()
        email: string;

        @ApiProperty()
        refreshToken: string;
    }

    export class ReqWithUser {

        @ApiProperty()
        email: string;
        @ApiProperty()
        user: AccountRegister.Response;
    };

    export class Response {
        access_token: string;
        refreshToken: string;
    }
}