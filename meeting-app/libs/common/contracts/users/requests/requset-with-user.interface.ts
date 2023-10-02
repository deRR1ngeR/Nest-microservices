import { Request } from 'express';
import { UserResponse } from '../responses/user.response';



export default interface RequestWithUser extends Request {
    user: UserResponse
}