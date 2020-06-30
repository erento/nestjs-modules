import {SetMetadata} from '@nestjs/common';
import {TOKEN} from './authorization.guard';

// tslint:disable-next-line variable-name
export const Auth: (tokenValue?: string | string[]) => Function = (
    tokenValue: string | string[] | undefined = undefined,
): Function => SetMetadata(TOKEN, tokenValue);
