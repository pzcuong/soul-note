import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    message: string;
    data: T | null;
}

@Injectable()
export class ResTransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    constructor(private reflector: Reflector) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                if (typeof data === 'object' && data?.message) {
                    return {
                        statusCode: context.switchToHttp().getResponse()
                            .statusCode,
                        ...data,
                    };
                }

                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message:
                        this.reflector.get<string>(
                            'responseMessage',
                            context.getHandler(),
                        ) || '',
                    data,
                };
            }),
            catchError((err) => {
                const statusCode = err.status || 500;
                const message = err.message || 'Internal Server Error';

                context.switchToHttp().getResponse().status(statusCode);

                const response: Response<T> = {
                    statusCode,
                    message,
                    data: null,
                };

                return of(response);
            }),
        );
    }
}
