export namespace AccountMarkEmailAsConfirmed {
    export const topic = 'Account.MarkEmailAsConfirmed.Command';

    export class Request {
        email: string
    }

    export class Response {
        isEmailConfirmed: boolean;
    }
}