import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AccountGoogleLogin } from 'libs/common/contracts/account/account.googleLogin';


export const GetGooglePayload = createParamDecorator(
    (_: undefined, context: ExecutionContext): AccountGoogleLogin.Request => {
        const request = context.switchToHttp().getRequest();
        const user = request?.user as AccountGoogleLogin.Request;
        return user;
    },
);