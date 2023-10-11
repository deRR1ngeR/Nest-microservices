import { IsBoolean, IsEmail, IsString } from 'class-validator';

export namespace AccountGoogleLogin {
    export const topic = 'Account.GoogleLogin.Command';

    export class Request {
        @IsEmail()
        @IsString()
        email: string;

        @IsString()
        name: string;

        @IsString()
        profile_photo: string;
    }


}