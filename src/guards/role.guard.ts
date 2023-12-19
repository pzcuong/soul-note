import { user_role } from './../commons/role';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppConfig } from 'src/app.config';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<user_role[]>(
            AppConfig.USER_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        if (user.role === user_role.ADMIN) return true;

        return requiredRoles.some((role) => {
            return user.role === role;
        });
    }
}
