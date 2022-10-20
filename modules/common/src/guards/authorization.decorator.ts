import {CustomDecorator, SetMetadata} from '@nestjs/common';
import {TOKEN} from './consts';

// tslint:disable-next-line variable-name
export const Auth: (tokenValue?: string | string[]) => CustomDecorator = (
    tokenValue: string | string[] | undefined = undefined,
): CustomDecorator => SetMetadata(TOKEN, tokenValue);
