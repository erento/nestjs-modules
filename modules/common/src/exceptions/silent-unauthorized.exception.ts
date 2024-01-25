import {UnauthorizedException} from './unauthorized.exception';

export class SilentUnauthorizedException extends UnauthorizedException {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    constructor (objectOrError?: string | object | any, description?: string, silent: boolean = true) {
        super(objectOrError, description, silent);
    }
}
