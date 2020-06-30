import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const TOKEN: string = 'authToken';
export const TOKEN_ROLE_HEADER: string = 'x-token-role';

export const NOT_AUTHORIZED_ERROR_NAME: string = 'Not Authorized';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}

    public canActivate (context: ExecutionContext): boolean {
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

        throw new HttpException({
            error: NOT_AUTHORIZED_ERROR_NAME,
            reason: `Provided token is "${requestTokenValue}"`,
            statusCode: HttpStatus.UNAUTHORIZED,
        }, HttpStatus.UNAUTHORIZED);
    }
}
