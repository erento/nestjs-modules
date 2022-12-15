import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {bugsnagIgnoredExceptions} from './consts';

@Injectable()
export class BugsnagIgnoreExceptionsInterceptor implements NestInterceptor {
    constructor (private readonly reflector: Reflector) {}

    public intercept (context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const exceptions: any[] | undefined = this.reflector.get<any[]>(bugsnagIgnoredExceptions, context.getHandler());
        if (!exceptions) {
            return next.handle();
        }

        return next
            .handle()
            .pipe(
                catchError((error: any): Observable<any> => {
                    if (exceptions.some((e: any): boolean => error instanceof e)) {
                        // return error as result to avoid errors being caught by Bugsnag
                        const response: any = context.switchToHttp()
                            .getResponse();

                        response.status(error.status || 500)
                            .json({err: error.response ? error.response.message : undefined});

                        return of(undefined);
                    }
                    // rethrow
                    throw error;
                }),
            );
    }
}
