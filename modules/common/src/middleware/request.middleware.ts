import {Injectable, NestMiddleware} from '@nestjs/common';
import * as httpContext from 'express-http-context';
import {REQUEST_KEY} from '../constants';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    public async use (req: Express.Request, _res: Express.Response, next: Function): Promise<void> {
        httpContext.set(REQUEST_KEY, req);
        next();
    }
}
