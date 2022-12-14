import {UnauthorizedException as NestJsUnauthorizedException} from '@nestjs/common';

export class UnauthorizedException extends NestJsUnauthorizedException {
    public silent: boolean = false;

    constructor (objectOrError?: string | object | any, description?: string, silent?: boolean) {
        super(objectOrError, description);
        this.silent = !!silent;
    }
}
