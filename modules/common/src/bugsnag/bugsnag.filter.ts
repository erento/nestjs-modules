import {Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
import {Response} from 'express';
import * as httpContext from 'express-http-context';
import * as jsonStringifySafe from 'json-stringify-safe';
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

    public catch (exception: HttpException, host: ArgumentsHost): any {
        const res: Response = host.switchToHttp().getResponse();
        const status: number = exception?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

        // tslint:disable-next-line:no-unbound-method
        (this?.loggerMethod ?? console.error)(
            // Stringify when err message is an object to avoid [object Object] only
            `>> status: "${status}" - "${jsonStringifySafe(exception)}" - "${jsonStringifySafe(exception.stack)}"`,
        );

        this.bugsnagClient.notifyWithMetaData(
            exception instanceof Error ? exception : new Error(exception),
            {
                severity: BugsnagSeverity.ERROR,
                breadcrumbs: getBreadcrumbs(),
                metaData: {
                    uniqueId: (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'unknown'),
                    reason: exception.message.reason,
                },
            },
        );
        clearBreadcrumbs();

        return res.status(status).send({
            err: exception.message,
        });
    }
}
