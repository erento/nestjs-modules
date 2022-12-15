/* eslint-disable @typescript-eslint/naming-convention */
export enum AuthorizationType {
    service = 'service',
    admin = 'admin',
    seller = 'seller',
}

export interface AuthOptions {
    silent: boolean;
}

export type AuthTokenValue = string | string[] | undefined;

export interface AuthMetadata {
    tokenValue: AuthTokenValue;
    options: AuthOptions;
}
