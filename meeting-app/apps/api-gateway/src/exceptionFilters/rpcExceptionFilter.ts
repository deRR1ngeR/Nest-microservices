import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';


export function sendError<T>(message: string, statusCode: number): ApiResponse<T> {
    return {
        status: 'error',
        statusCode,
        message,
        data: null,
    };
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    statusCode: number;
    message: string;
    data: T | null;
}


@Catch(RpcException)
export class RpcExceptionToHttpExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // You can further customize the status code and the response based on the exception message or error code
        let err: any = exception.getError();
        let status = 404;
        if (err && err.statusCode) {
            status = err.statusCode;
        }
        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });
    }
}