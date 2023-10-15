import { AccountLogin } from '../account.login';
import { AccountRegister } from '../account.register';

export interface RequestWithUser extends Request {
    user: AccountRegister.Response
} 