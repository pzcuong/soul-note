import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
    AccessTokenSignPayload,
    ClientData,
} from 'src/decorators/get_current_user.decorator';

@Injectable()
export class EncryptionsUtil {
    constructor(private readonly jwtService: JwtService) {}

    private hashSecretKey = process.env.HASH_SECRET_KEY;

    public signAccessToken(authJwtPayload: AccessTokenSignPayload): string {
        return this.jwtService.sign(authJwtPayload);
    }

    public verifyAccessToken(
        jwt: string,
        options?: Omit<JwtVerifyOptions, 'secret'>,
    ): ClientData {
        return this.jwtService.verify<ClientData>(jwt, options);
    }

    public hash(key: string): string {
        return bcrypt.hashSync(key + this.hashSecretKey, 10);
    }

    public isMatchWithHashedKey(key: string, hashedKey: string): boolean {
        return bcrypt.compareSync(`${key}${this.hashSecretKey}`, hashedKey);
    }

    public verifyMatchPassword(
        password: string,
        hashedPassword: string,
    ): boolean {
        const isMatchPassword = this.isMatchWithHashedKey(
            password,
            hashedPassword,
        );
        if (!isMatchPassword) {
            throw new UnauthorizedException({
                errorCode: 'PASSWORD_IS_NOT_CORRECT',
                message: 'Password is not correct!',
            });
        }
        return isMatchPassword;
    }
}
