import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from 'src/app.config';
import { EncryptionsUtil } from './encryptions.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET_KEY'),
                    signOptions: {
                        expiresIn: AppConfig.ACCESS_TOKEN_EXPIRES,
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [EncryptionsUtil],
    exports: [EncryptionsUtil],
})
export class EncryptionsModule {}
