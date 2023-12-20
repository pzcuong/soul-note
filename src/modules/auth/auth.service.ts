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
            where: [
                {
                    email: payload.email,
                },
                {
                    username: payload.username,
                },
            ],
        });

        if (existUser) throw new BadRequestException('User already exist!');

        const password = this.encryptionsUtil.hash(payload.password);

        const createResult = await this.userModel.repository.save({
            email: payload.email,
            password,
            role: user_role.USER,
            full_name: payload.full_name,
            username: payload.username,
            date_of_birth: payload.date_of_birth,
        });

        if (!createResult._id || !createResult.role)
            throw new NotFoundException();

        const accessToken = this.encryptionsUtil.signAccessToken({
            id: createResult._id,
            sub: createResult._id,
            role: createResult.role as user_role,
            username: createResult.username,
        });

        delete createResult.password;

        return { accessToken, ...createResult };
    }

    public async login(payload: LoginDto) {
        const user = await this.userModel.repository.findOne({
            where: {
                email: payload.email,
            },
            select: ['_id', 'password', 'role', 'username', 'date_of_birth'],
        });

        if (!user) throw new UnauthorizedException('User does not exist!');

        await this.encryptionsUtil.verifyMatchPassword(
            payload.password,
            user.password,
        );

        const accessToken = this.encryptionsUtil.signAccessToken({
            id: user._id,
            sub: user._id,
            role: user.role as user_role,
            username: user.username,
        });

        delete user.password;

        return { accessToken, ...user };
    }
}
