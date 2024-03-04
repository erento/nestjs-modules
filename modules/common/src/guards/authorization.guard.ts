import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import * as jsonStringifySafe from 'json-stringify-safe';
import {SilentUnauthorizedException} from '../exceptions/silent-unauthorized.exception';
import {UnauthorizedException} from '../exceptions/unauthorized.exception';
import {TOKEN, TOKEN_ROLE_HEADER} from './consts';
import {AuthMetadata} from './interfaces';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp()
            .getRequest();
        const {handler}: any = context;

        const authMetadata: AuthMetadata = this.reflector.get<AuthMetadata>(TOKEN, handler);

        if (!authMetadata || authMetadata.tokenValue === undefined) {
            return true;
        }

        const tokenValueList: string[] = Array.isArray(authMetadata.tokenValue) ? authMetadata.tokenValue : [authMetadata.tokenValue];
        const requestTokenValue: string = req.headers[TOKEN_ROLE_HEADER];

        if (tokenValueList.includes(requestTokenValue)) {
            return true;
        }

        console.log(`Required token value "${jsonStringifySafe(authMetadata.tokenValue)}", given value "${requestTokenValue}"`);

        const message: string = `Provided token is "${requestTokenValue}"`;
        throw authMetadata.options.silent ?
            new SilentUnauthorizedException(message) :
            new UnauthorizedException(message);
    }
}
