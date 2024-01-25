import {UnauthorizedException as NestJsUnauthorizedException} from '@nestjs/common';

export class UnauthorizedException extends NestJsUnauthorizedException {
    public silent: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    constructor (objectOrError?: string | object | any, description?: string, silent?: boolean) {
        super(objectOrError, description);
        this.silent = !!silent;
    }
}
