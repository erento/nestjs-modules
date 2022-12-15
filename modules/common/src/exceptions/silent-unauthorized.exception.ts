import {UnauthorizedException} from './unauthorized.exception';

export class SilentUnauthorizedException extends UnauthorizedException {
    constructor (objectOrError?: string | object | any, description?: string, silent: boolean = true) {
        super(objectOrError, description, silent);
    }
}
