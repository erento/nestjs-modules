import {Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {ArgumentsHost} from '@nestjs/common/interfaces/features/arguments-host.interface';
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

    public catch (err: any, host: ArgumentsHost): any {
        const res: any = host.switchToHttp().getResponse();
        const status: any = err && typeof err.getStatus === 'function' ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // tslint:disable-next-line:no-unbound-method
        (this.loggerMethod ? this.loggerMethod : console.error)(
            // Stringify when err message is an object to avoid [object Object] only
            `>> status: "${status}" - "${jsonStringifySafe(err)}" - "${jsonStringifySafe(err.stack)}"`,
        );

        this.bugsnagClient.notifyWithMeta(
            err instanceof Error ? err : new Error(err),
            {
                severity: BugsnagSeverity.ERROR,
                metaData: {
                    uniqueId: (httpContext.get(REQUEST_UNIQUE_ID_KEY) || 'unknown'),
                    reason: err.message.reason,
                    breadcrumbs: getBreadcrumbs(),
                },
            },
        );
        clearBreadcrumbs();

        return res.status(status).send({
            err: err.message,
        });
    }
}
