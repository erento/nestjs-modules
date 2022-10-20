import {UnauthorizedException} from '@nestjs/common';

export class CommonUnauthorizedException extends UnauthorizedException {
    public silent: boolean = false;
    constructor (objectOrError?: string | object | any, description?: string, silent?: boolean) {
        super(objectOrError, description);
        this.silent = !!silent;
    }
}
