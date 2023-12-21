import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { JoiPipeModule } from 'nestjs-joi';

import { JwtAuthGuard } from './guards/jwt.guard';
import { ModelsModule } from './models/models.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RolesGuard } from './guards/role.guard';
import { AuthModule } from './modules/auth/auth.module';
import { EncryptionsModule } from './modules/encryptions/encryptions.module';
import { NoteModule } from './modules/note/note.module';
import { FavouriteModule } from './modules/favourite/favourite.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WinstonModule.forRoot({}),
        ThrottlerModule.forRoot({ ttl: 10, limit: 100 }),
        JoiPipeModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: process.env.MONGODB_URI,
            synchronize: true,
            useUnifiedTopology: true,
            entities: ['dist/**/*.entity{.ts,.js}'],
        }),

        ModelsModule,
        CloudinaryModule,
        AuthModule,
        EncryptionsModule,
        NoteModule,
        FavouriteModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
    controllers: [],
})
export class AppModule {}
