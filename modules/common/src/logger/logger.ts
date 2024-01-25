import {Injectable, LoggerService, Optional} from '@nestjs/common';
// eslint-disable-next-line unicorn/import-style
import * as chalk from 'chalk';
import * as httpContext from 'express-http-context';
import * as jsonStringifySafe from 'json-stringify-safe';
import {clearBreadcrumbs, getBreadcrumbs} from '../bugsnag/breadcrumbs';
import {BugsnagClient} from '../bugsnag/bugsnag.client';
import {BugsnagSeverity} from '../bugsnag/interfaces';
import {REQUEST_KEY} from '../constants';
import {Environments} from '../environments/environments';
import {getCurrentRequestUniqueId} from './logger.utils';

enum LoggerMethod {
    INFO = 'INFO', // Needs to be INFO for Google Stack Driver compatibility
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

const dateOptions: Intl.DateTimeFormatOptions = {
    ...(Environments.isProd() ? {timeZone: 'UTC'} : {}),
};

function uniqueIdToHex (str: string): string {
    let hashedNumber: number = 0;
    for (let i: number = 0; i < str.length; i++) {
        // eslint-disable-next-line unicorn/prefer-code-point, no-bitwise
        hashedNumber = str.charCodeAt(i) + ((hashedNumber << 5) - hashedNumber);
    }

    // eslint-disable-next-line no-bitwise
    const c: string = (hashedNumber & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.slice(0, Math.max(0, 6 - c.length)) + c;
}

type colorMethodFunction = (uniqueId: string) => chalk.Chalk;
const colorMethod: colorMethodFunction = (uniqueId: string): chalk.Chalk => chalk.hex(uniqueIdToHex(uniqueId));

type consoleFunction = (...data: any[]) => string;
type consoleVoidFunction = (...data: any[]) => void;
type logFunction = (method: LoggerMethod, uniqueId: string, message: string | Record<string, string>) => void;
const log: logFunction = (method: LoggerMethod, uniqueId: string, message: string | Record<string, string>): void => {
    const logMethod: consoleVoidFunction = method === LoggerMethod.ERROR ?
        console.error :
        (
            method === LoggerMethod.WARNING ? console.warn : console.log
        );

    if (Environments.isDev()) {
        const methodColor: consoleFunction = method === LoggerMethod.ERROR ?
            chalk.red.bold :
            (
                method === LoggerMethod.WARNING ? chalk.yellow.bold : chalk.cyan
            );

        const messageColor: consoleFunction = colorMethod(uniqueId);
        logMethod(
            chalk.gray(`${new Date(Date.now())
                .toLocaleString('en-GB', dateOptions)}`),
            `${methodColor((`${method}  `).slice(0, 5))} ${messageColor(uniqueId)}`,
            chalk.white(jsonStringifySafe(message)),
        );

        return;
    }

    let jsonLog: LogObject = {
        requestId: uniqueId,
        severity: method,
        time: new Date(Date.now())
            .toISOString(),
    };

    if (typeof (message) === 'string') {
        jsonLog.message = message;
    } else {
        jsonLog = {
            ...jsonLog,
            ...message,
        };
    }

    jsonLog.httpRequest = httpContext.get(REQUEST_KEY);

    logMethod(jsonStringifySafe(jsonLog));
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
            log(LoggerMethod.INFO, getCurrentRequestUniqueId(), [message, ...args].join(' '));
        } else {
            if (args.length > 0) {
                message.additionalArguments = jsonStringifySafe(args);
            }
            log(LoggerMethod.INFO, getCurrentRequestUniqueId(), message);
        }
    }

    public warn (err: any): void {
        const uniqueId: string = getCurrentRequestUniqueId();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = error.message.includes(uniqueId) ? `${uniqueId}: ${error.message}` : error.message;

        log(LoggerMethod.WARNING, uniqueId, {
            errorMessage: error.message,
            errorStack: error.stack ?? '',
            errorName: error.name,
        });

        if (!this.bugsnagClient) {
            return;
        }

        this.bugsnagClient.notifyWithMetadata(
            error,
            {
                severity: BugsnagSeverity.WARNING,
                breadcrumbs: getBreadcrumbs(),
                metadata: {
                    uniqueId: getCurrentRequestUniqueId(),
                },
            },
        );
        clearBreadcrumbs();
    }

    public error (err: any, trace?: any): void {
        const uniqueId: string = getCurrentRequestUniqueId();
        const error: Error = err instanceof Error ? err : new Error(err);
        error.message = error.message.includes(uniqueId) ? `${uniqueId}: ${error.message}` : error.message;
        if (!(err instanceof Error) && trace) {
            error.stack = trace;
        }

        log(LoggerMethod.ERROR, uniqueId, {
            errorMessage: error.message,
            errorStack: error.stack ?? '',
            errorName: error.name,
        });

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
                    uniqueId: getCurrentRequestUniqueId() || 'unknown',
                },
            },
        );
        clearBreadcrumbs();
    }
}
