import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserModel } from '../../../models/user.model';
import { ClientData } from 'src/decorators/get_current_user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userModel: UserModel) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    validate(payload: ClientData) {
        if (payload.id && payload.role) {
            return payload;
        }
        // TODO: User should have both access token and refresh token

        throw new UnauthorizedException();
    }
}
