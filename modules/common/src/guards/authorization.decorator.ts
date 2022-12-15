import {CustomDecorator, SetMetadata} from '@nestjs/common';
import {TOKEN} from './consts';
import {AuthMetadata, AuthOptions, AuthTokenValue} from './interfaces';

// tslint:disable-next-line variable-name
export const Auth: (tokenValue: AuthTokenValue, options?: AuthOptions) => CustomDecorator = (
    tokenValue: AuthTokenValue = undefined,
    options?: AuthOptions,
): CustomDecorator => SetMetadata(TOKEN, <AuthMetadata> {tokenValue, options: {
    silent: false,
    ...options,
}});
