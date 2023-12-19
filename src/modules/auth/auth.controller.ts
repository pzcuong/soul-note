import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IsPublicEndpoint } from 'src/commons/decorators';
import { ResTransformInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/decorators/response_message.decorator';

@Controller('/auth')
@UseInterceptors(ResTransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Register successfully!')
    @IsPublicEndpoint()
    public async register(@Body() payload: RegisterDto) {
        return await this.authService.register(payload);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login successfully!')
    @IsPublicEndpoint()
    public async login(@Body() payload: LoginDto) {
        return await this.authService.login(payload);
    }
}
