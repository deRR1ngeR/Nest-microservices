import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/contracts/users/dtos/create-user.dto';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ApiGatewayAuthService {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

    register(dto: CreateUserDto) {
        return this.authService.send('register', dto).pipe(
            catchError((error) =>
                throwError(() => new RpcException(error.response)),
            ),
        );;
    }
}
