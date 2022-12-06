import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import * as httpContext from 'express-http-context';
import {v4 as uuidv4} from 'uuid';
import {REQUEST_UNIQUE_ID_KEY, REQUEST_UNIQUE_ID_QUERY_PARAM} from '../constants';
import {Environments} from '../environments/environments';

@Injectable()
export class UniqueIdMiddleware implements NestMiddleware {
    public use (req: Request, _res: Response, next: () => void): void {
        let uniqueID: string = (<any> req.query || [])[REQUEST_UNIQUE_ID_QUERY_PARAM];
        if (!uniqueID) {
            uniqueID = `${Environments.getApplicationName()}_${Environments.getVersion()}_${uuidv4()}`;
        }
        httpContext.set(REQUEST_UNIQUE_ID_KEY, uniqueID);
        next();
    }
}
