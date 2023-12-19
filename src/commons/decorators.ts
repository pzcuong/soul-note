import {
    applyDecorators,
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppConfig } from 'src/app.config';
import { user_role } from './role';

export const Client = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { user } = ctx.switchToHttp().getRequest();

        if (!user) {
            throw new BadRequestException(
                'Access token payload does not exist!',
            );
        }

        return user;
    },
);

export const RequireRoles = (roles: user_role[]) =>
    SetMetadata(AppConfig.USER_ROLES_KEY, roles);

export const IsPublicEndpoint = () =>
    SetMetadata(AppConfig.PUBLIC_ENDPOINT_METADATA, true);

export function Auth(roles: user_role[]) {
    return applyDecorators(
        SetMetadata(AppConfig.USER_ROLES_KEY, roles),
        // UseGuards(JwtAuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
