import {Environments} from './environments/environments';
import {TOKEN_ROLE_HEADER} from './guards/consts';
import {AuthorizationType} from './guards/interfaces';

export const REQUEST_UNIQUE_ID_BREADCRUMBS_KEY: string = 'nestRequestUniqueIdForBreadcrumbs';
export const REQUEST_UNIQUE_ID_KEY: string = 'nestRequestUniqueId';
export const REQUEST_UNIQUE_ID_QUERY_PARAM: string = '_requestUniqueId';
export const REQUEST_KEY: string = 'nestRequest';

export const BUGSNAG_LOGGER_ENABLED: boolean = process.env.BUGSNAG_LOGGER_ENABLED !== '0' && process.env.BUGSNAG_LOGGER_ENABLED !== 'false';

export const GRACE_PERIOD: number = 20000; // default grace period in k8s is 30s so let's try to finish all requests in 20s
export const SHUTDOWN_TIMEOUT_PERIOD: number = 500;

export const USER_AGENT: string = `${Environments.getApplicationName()}@${Environments.getVersion()}`;

export const COMMON_SERVICE_HEADERS: Record<string, string> = {
    [TOKEN_ROLE_HEADER]: AuthorizationType.service,
    'user-agent': USER_AGENT,
};

export const COMMON_HEADERS: Record<string, string> = {
    ...COMMON_SERVICE_HEADERS,
    'content-type': 'application/json',
};

export const NON_PRODUCTION_NULL_ENVIRONMENT_KEYS: string[] = ['GOOGLE_SITEMAP_CREDENTIALS'];
