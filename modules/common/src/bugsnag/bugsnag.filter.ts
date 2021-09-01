import {Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
import {Response} from 'express';
import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_KEY} from '../constants';
import {clearBreadcrumbs, getBreadcrumbs} from './breadcrumbs';
import {BugsnagClient} from './bugsnag.client';
import {BugsnagSeverity} from './interfaces';

@Catch()
export class BugsnagErrorFilter implements ExceptionFilter {
    constructor (
        private readonly bugsnagClient: BugsnagClient,
        private readonly loggerMethod?: Function,
    ) {}

    public catch (err: any, host: ArgumentsHost): Response {
        const res: Response = host.switchToHttp().getResponse();
        const status: number = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const exception: Error = err instanceof Error ? err : new Error(err);

        // tslint:disable-next-line:no-unbound-method
        (this.loggerMethod || console.error)(exception);

        this.bugsnagClient.notifyWithMetadata(
            exception,
            {
                severity: BugsnagSeverity.ERROR,
                breadcrumbs: getBreadcrumbs(),
                metadata: {
                    uniqueId: (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'unknown'),
                    reason: exception.message,
                },
            },
        );
        clearBreadcrumbs();

        return res.status(status).send({
            err: exception.message,
        });
    }
}
