import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

import { IsEmail, IsOptional, IsString } from 'class-validator';


export namespace AccountRegister {
    export const topic = 'Account.Register.Command';

    export class Request {
        @ApiProperty()
        @IsEmail()
        email: string;

        @ApiProperty()
        password?: string;

        @ApiProperty()
        @IsString()
        name: string;

        @ApiProperty({ required: false })
        @IsString()
        @IsOptional()
        profile_photo?: string;
    }

    export class Response {
        @ApiProperty()
        id: number;

        @ApiProperty()
        email: string;

        @ApiProperty()
        role: $Enums.Role;
    }

}
