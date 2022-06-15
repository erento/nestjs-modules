import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const TOKEN: string = 'authToken';
export const TOKEN_ROLE_HEADER: string = 'x-token-role';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
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

        throw new UnauthorizedException(`Provided token is "${requestTokenValue}"`);
    }
}
