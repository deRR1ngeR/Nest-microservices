export namespace AccountAvatarUpdate {
    export const topic = 'Account.AvatarUpdate.Command';

    export class Request {
        userId: number;
        fileName: string;
    }
}