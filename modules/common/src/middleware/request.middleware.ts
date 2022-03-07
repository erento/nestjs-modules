import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import * as httpContext from 'express-http-context';
import {REQUEST_KEY} from '../constants';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    public use (req: Request, _res: Response, next: () => void): void {
        httpContext.set(REQUEST_KEY, {
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            userAgent: req.header('user-agent'),
            protocol: req.protocol,
            serverIp: req.hostname,
        });
        next();
    }
}
