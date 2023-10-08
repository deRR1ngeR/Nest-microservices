export namespace AccountValidate {
    export const topic = 'Account.Validate.Command';

    export class Request {
        email: string;
        password: string;
    }
}