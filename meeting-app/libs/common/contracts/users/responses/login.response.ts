import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class LoginResponse {

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    user: UserResponse;
}