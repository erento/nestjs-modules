import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {CommonUnauthorizedException} from '../exceptions/common-unauthorized.exception';
import {SILENT_FAIL_TOKEN, TOKEN, TOKEN_ROLE_HEADER} from './consts';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp()
            .getRequest();
        const {handler}: any = context;

        const tokenValue: string | string[] | undefined = this.reflector.get<string | string[] | undefined>(TOKEN, handler);

        if (tokenValue === undefined) {
            return true;
        }

        const tokenValueList: string[] = Array.isArray(tokenValue) ? tokenValue : [tokenValue];
        const requestTokenValue: string = req.headers[TOKEN_ROLE_HEADER];

        if (tokenValueList.indexOf(requestTokenValue) !== -1) {
            return true;
        }

        console.log(`Required token value "${tokenValue}", given value "${requestTokenValue}"`);

        const silent: boolean = !!this.reflector.get<string>(SILENT_FAIL_TOKEN, handler);

        throw new CommonUnauthorizedException(`Provided token is "${requestTokenValue}"`, undefined, silent);
    }
}
