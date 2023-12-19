import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserModel } from 'src/models/user.model';

import { EncryptionsUtil } from '../encryptions/encryptions.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { user_role } from 'src/commons/role';

@Injectable()
export class AuthService {
    constructor(
        private readonly userModel: UserModel,
        private readonly encryptionsUtil: EncryptionsUtil,
    ) {}

    public async register(payload: RegisterDto) {
        const existUser = await this.userModel.repository.findOne({
            where: {
                email: payload.email,
            },
        });

        if (existUser) throw new BadRequestException('User already exist!');

        const password = this.encryptionsUtil.hash(payload.password);
        console.log(password);

        const createResult = await this.userModel.repository.save({
            email: payload.email,
            password,
            role: user_role.USER,
            full_name: payload.full_name,
            username: payload.username,
        });

        console.log(createResult);

        if (!createResult.id || !createResult.role)
            throw new NotFoundException();

        const accessToken = this.encryptionsUtil.signAccessToken({
            id: createResult.id,
            sub: createResult.id,
            role: createResult.role as user_role,
            username: createResult.username,
        });

        return { accessToken };
    }

    public async login(payload: LoginDto) {
        const user = await this.userModel.repository.findOne({
            where: {
                email: payload.email,
            },
            select: ['id', 'password', 'role', 'username'],
        });

        if (!user) throw new UnauthorizedException('User does not exist!');

        await this.encryptionsUtil.verifyMatchPassword(
            payload.password,
            user.password,
        );

        const accessToken = this.encryptionsUtil.signAccessToken({
            id: user.id,
            sub: user.id,
            role: user.role as user_role,
            username: user.username,
        });

        delete user.password;

        return { accessToken, ...user };
    }
}
