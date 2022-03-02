import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_KEY} from '../constants';

export function getCurrentRequestUniqueId (): string {
    const uniqueId: string = httpContext.get(REQUEST_UNIQUE_ID_KEY);

    return uniqueId || '';
}
