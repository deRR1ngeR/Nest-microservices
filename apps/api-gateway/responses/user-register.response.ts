import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class UserRegisterResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    isEmailConfirmed: boolean;

    @ApiProperty()
    role: $Enums.Role;
}