export namespace AccountGetUserByEmail {
    export const topic = 'Account.GetUserByEmail.Command';

    export class Request {
        email: string;
    }
}