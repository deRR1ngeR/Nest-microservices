import { ApiProperty } from '@nestjs/swagger';

import { User } from '@prisma/client';

import { IsEmail, IsOptional, IsString } from 'class-validator';

type CreateUserType = Omit<User, 'id' | 'role' | 'profile_photo'> & Partial<Pick<User, 'profile_photo'>>;

export class CreateUserDto implements CreateUserType {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    profile_photo?: string;

}