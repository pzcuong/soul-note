import { ObjectId } from 'typeorm';
import { user_role } from './../commons/role';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type ClientData = AccessTokenSignPayload & {
    iat: number;
    exp: number;
};

export type AccessTokenSignPayload = {
    sub: ObjectId;
    id: ObjectId;
    role: (typeof user_role)[keyof typeof user_role];
    username?: string;
};

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (data) {
            return request.user[data];
        }
        return request.user;
    },
);
