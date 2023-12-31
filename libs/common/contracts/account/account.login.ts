import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export namespace AccountLogin {
    export const topic = 'Account.Login.Command';

    export class Request {

        @ApiProperty()
        @IsEmail()
        email: string;

        @ApiProperty()
        @IsString()
        password: string;
    }

    export class Response {
        @ApiProperty()
        access_token: string;

        @ApiProperty()
        refreshToken: string;
    }
}