import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import * as httpContext from 'express-http-context';
import {v4 as uuidv4} from 'uuid';
import {REQUEST_UNIQUE_ID_KEY, REQUEST_UNIQUE_ID_QUERY_PARAM} from '../constants';

@Injectable()
export class UniqueIdMiddleware implements NestMiddleware {
    public async use (req: Request, _res: Response, next: Function): Promise<void> {
        const uniqueID: string = (req.query || [])[REQUEST_UNIQUE_ID_QUERY_PARAM] || uuidv4();
        httpContext.set(REQUEST_UNIQUE_ID_KEY, uniqueID);
        next();
    }
}
