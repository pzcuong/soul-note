import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.OnUncaughtException(),
            new Sentry.Integrations.OnUnhandledRejection(),
        ],
        tracesSampleRate: 1.0,
    });

    const configService = app.get(ConfigService);

    const API_PORT = configService.get<string>('API_PORT') ?? 4000;

    app.setGlobalPrefix('api');
    app.enableCors({});
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory(errors) {
                const error = errors
                    .map((error) => {
                        return Object.values(error.constraints);
                    })
                    .join(', ');
                const message = `Validation failed`;
                return new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message,
                        error,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            },
        }),
    );

    app.use(json({ limit: '6mb' }));
    app.use(urlencoded({ extended: true, limit: '6mb' }));
    await app.listen(API_PORT);
}
bootstrap();
