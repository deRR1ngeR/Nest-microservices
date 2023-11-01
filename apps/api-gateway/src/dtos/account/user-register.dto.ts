import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserRegisterDto {
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