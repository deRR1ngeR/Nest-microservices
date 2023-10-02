import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGatewayAuthService } from '../services/api-gateway-auth.service';
import { CreateUserDto } from 'libs/common/contracts/users/dtos/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class ApiGatewayAuthController {

    constructor(private readonly apiGatewayAuthService: ApiGatewayAuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.apiGatewayAuthService.register(createUserDto);
    }
}