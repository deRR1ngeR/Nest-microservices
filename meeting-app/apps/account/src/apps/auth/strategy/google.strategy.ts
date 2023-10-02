// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';

// import { Strategy, VerifyCallback } from 'passport-google-oauth2';
// import { UsersService } from '../../users/users.service';
// import { CreateUserDto } from '../../users/dto/create-user.dto';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

//     constructor(
//         private readonly configService: ConfigService,
//         private readonly userService: UsersService
//     ) {
//         super({
//             clientId: configService.get('CLIENT_ID'),
//             clientSecret: configService.get('CLIENT_SECRET'),
//             callbackURL: configService.get('CALLBACK_URL'),
//             scope: ['email']
//         });
//     }

//     async validate(
//         _accessToken: string,
//         _refreshToken: string,
//         profile: CreateUserDto,
//         done: VerifyCallback,
//     ): Promise<any> {
//         this.userService.createUser(profile);
//     }
// }