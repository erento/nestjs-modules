import * as httpContext from 'express-http-context';
import {REQUEST_UNIQUE_ID_BREADCRUMBS_KEY} from '../constants';

export function getBreadcrumbs (): Record<string, any> {
    return httpContext.get(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY) || {};
}

export function leaveBreadcrumb (name: string, metaData?: object): void {
    try {
        // currently on 12.4.2019 are breadcrumbs not yet supported in NodeJS, but we are prepared, and currently fall backing to notify
        // bugsnagClient.leaveBreadcrumb(name, metaData);

        const breadcrumbs: Record<string, any> = getBreadcrumbs();
        breadcrumbs[new Date().toISOString()] = {
            name,
            metaData,
        };
        httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, breadcrumbs);
    } catch {}
}

export function clearBreadcrumbs (): void {
    httpContext.set(REQUEST_UNIQUE_ID_BREADCRUMBS_KEY, {});
}
