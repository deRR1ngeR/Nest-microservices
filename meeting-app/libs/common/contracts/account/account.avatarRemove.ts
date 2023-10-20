export namespace AccountAvatarRemove {
    export const topic = 'Account.AvatarRemove.Command';

    export class Request {
        userId: number;
    }
}