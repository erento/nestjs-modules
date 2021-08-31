import {Injectable, LoggerService, Optional} from '@nestjs/common';
import * as chalk from 'chalk';
import * as httpContext from 'express-http-context';
import {clearBreadcrumbs, getBreadcrumbs} from '../bugsnag/breadcrumbs';
import {BugsnagClient} from '../bugsnag/bugsnag.client';
import {BugsnagSeverity} from '../bugsnag/interfaces';
import {REQUEST_KEY, REQUEST_UNIQUE_ID_KEY} from '../constants';
import {Environments} from '../environments/environments';

enum LoggerMethod {
    INFO = 'INFO', // Needs to be INFO for Google Stack Driver compatibility
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

const dateOptions: Intl.DateTimeFormatOptions = {
    ...{},
    ...(Environments.isProd() ? {timeZone: 'UTC'} : {}),
};

function uniqueIdToHex (str: string): string {
    let hashedNumber: number = 0;
    for (let i: number = 0; i < str.length; i++) {
        // tslint:disable-next-line:no-bitwise
        hashedNumber = str.charCodeAt(i) + ((hashedNumber << 5) - hashedNumber);
    }

    // tslint:disable-next-line:no-bitwise
    const c: string = (hashedNumber & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}

const colorMethod: Function = (uniqueId: string): Function => chalk.hex(uniqueIdToHex(uniqueId));

const log: Function = (method: LoggerMethod, uniqueId: string, message: string | Record<string, string>): void => {
    /* tslint:disable:no-unbound-method */
    const logMethod: Function = method === LoggerMethod.ERROR ? console.error : (
        method === LoggerMethod.WARNING ? console.warn : console.log
    );
    /* tslint:enable:no-unbound-method */

    if (Environments.isDev()) {
        const methodColor: Function = method === LoggerMethod.ERROR ? chalk.red.bold : (
            method === LoggerMethod.WARNING ? chalk.yellow.bold : chalk.cyan
        );

        const messageColor: Function = colorMethod(uniqueId);
        logMethod(
            chalk.gray(`${new Date(Date.now()).toLocaleString('en-GB', dateOptions)}`),
            `${methodColor((method + '  ').substr(0, 5))} ${messageColor(uniqueId)}`,
            chalk.white(JSON.stringify(message)),
        );
        return;
    }

    let jsonLog: LogObject = {
        requestId: uniqueId,
        severity: method,
        time: new Date(Date.now()).toISOString(),
    };

    if (typeof(message) === 'string') {
        jsonLog.message = message;
    } else {
        jsonLog = {
            ...jsonLog,
            ...message,
        };
    }

    jsonLog.httpRequest = httpContext.get(REQUEST_KEY);

    logMethod(JSON.stringify(jsonLog));
};

interface StackDriverHttpRequest {
    requestMethod: string;
    requestUrl: string;
    userAgent: string;
    protocol: string;
}

interface LogObject {
    requestId: string;
    severity: string;
    time: string;
    message?: string;
    httpRequest?: StackDriverHttpRequest;
}

@Injectable()
export class Logger implements LoggerService {
    constructor (
        @Optional() private readonly bugsnagClient?: BugsnagClient,
    ) {}

    public log (message: string | Record<string, string>, ...args: string[]): void {
        if (typeof (message) === 'string') {
            log(LoggerMethod.INFO, this.getUniqueKey(), [message, ...args].join(' '));
        } else {
            if (args.length > 0) {
                message.additionalArguments = JSON.stringify(args);
            }
            log(LoggerMethod.INFO, this.getUniqueKey(), message);
        }
    }

    public warn (err: any): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = error.message.indexOf(uniqueId) !== -1 ? `${uniqueId}: ${error.message}` : error.message;

        log(LoggerMethod.WARNING, uniqueId, error);
        if (!this.bugsnagClient) {
            return;
        }

        this.bugsnagClient.notifyWithMetadata(
            error,
            {
                severity: BugsnagSeverity.WARNING,
                breadcrumbs: getBreadcrumbs(),
                metadata: {
                    uniqueId: this.getUniqueKey(),
                },
            },
        );
        clearBreadcrumbs();
    }

    public error (err: any, trace?: any): void {
        const uniqueId: string = this.getUniqueKey();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = error.message.indexOf(uniqueId) !== -1 ? `${uniqueId}: ${error.message}` : error.message;
        if (!(err instanceof Error) && trace) {
            error.stack = trace;
        }

        log(LoggerMethod.ERROR, uniqueId, error);
        if (!this.bugsnagClient) {
            return;
        }

        this.bugsnagClient.notifyWithMetadata(
            error,
            {
                severity: BugsnagSeverity.ERROR,
                context: trace,
                breadcrumbs: getBreadcrumbs(),
                metadata: {
                    uniqueId: this.getUniqueKey() || 'unknown',
                },
            },
        );
        clearBreadcrumbs();
    }

    public getUniqueKey (): string {
        const uniqueId: string = httpContext.get(REQUEST_UNIQUE_ID_KEY);
        if (!uniqueId) {
            return '';
        }

        return uniqueId;
    }
}
