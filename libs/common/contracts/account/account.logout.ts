import { ApiProperty } from '@nestjs/swagger';

export namespace AccountLogout {
    export const topic = 'Account.Logout.Command';

    export class Request {
        @ApiProperty()
        userId: number;
    }
}