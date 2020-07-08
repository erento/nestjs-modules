import {Breadcrumb} from '@bugsnag/js';
import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_BREADCRUMBS_KEY} from '../constants';

export function getBreadcrumbs (): Breadcrumb[] {
    return httpContext.get(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY) || [];
}

export function leaveBreadcrumb (name: string, metaData?: Record<string, any>): void {
    try {
        const breadcrumbs: Breadcrumb[] = getBreadcrumbs();
        breadcrumbs.push({
            message: name,
            timestamp: new Date(),
            metadata: metaData || {},
            type: 'manual',
        });
        httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, breadcrumbs);
    } catch {}
}

export function clearBreadcrumbs (): void {
    httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, []);
}
