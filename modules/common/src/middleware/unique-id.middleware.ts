import {Injectable, NestMiddleware} from '@nestjs/common';
import * as httpContext from 'express-http-context';
import {v4 as uuidv4} from 'uuid';
import {REQUEST_UNIQUE_ID_KEY} from '../constants';

@Injectable()
export class UniqueIdMiddleware implements NestMiddleware {
    public async use (req: Express.Request, _res: Express.Response, next: Function): Promise<void> {
        let userAgent: string = '--unknown agent--';
        try {
            userAgent = req['headers']['user-agent'] || userAgent;
        } catch {}
        httpContext.set(REQUEST_UNIQUE_ID_KEY, `${uuidv4()} -npm ${userAgent}`);
        next();
    }
}
