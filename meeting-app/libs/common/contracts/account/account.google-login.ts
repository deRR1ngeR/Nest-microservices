import { IsEmail, IsString } from 'class-validator';
import ITokenPayload from './interfaces/token-payload.interface';

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