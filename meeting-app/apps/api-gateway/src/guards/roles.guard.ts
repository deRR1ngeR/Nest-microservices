import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('role', context.getHandler());
        if (!roles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return this.matchRoles(roles, user.role);
    }

    matchRoles(roles: string[], userRole: string): boolean {
        return roles.some((role) => role === userRole);
    }
}