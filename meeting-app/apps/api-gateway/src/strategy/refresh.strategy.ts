// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';

// import { Request } from 'express';

// import { ExtractJwt, Strategy } from 'passport-jwt';

// import { AuthService } from '../auth.service';
// import ITokenPayload from '../interfaces/token-payload.interface';
// import { UserResponse } from 'libs/common/contracts/users/responses/user.response';

// @Injectable()
// export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

//     constructor(private readonly configService: ConfigService,
//         private readonly authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromExtractors([
//                 (req: Request) => {
//                     return req?.cookies?.refreshToken;
//                 }
//             ]),
//             ignoreExpiration: true,
//             secretOrKey: configService.get('JWT_REFRESH_TOKEN'),
//             passReqToCallback: true,
//         });
//     }

//     async validate(req: Request, { email }: ITokenPayload): Promise<UserResponse> {
//         const refreshToken = req?.cookies?.refreshToken;
//         return this.authService.getUserIfRefreshTokenMatches(email, refreshToken)
//     }
// }