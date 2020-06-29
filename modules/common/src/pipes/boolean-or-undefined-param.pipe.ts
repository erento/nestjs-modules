import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class BooleanOrUndefinedParamsPipe implements PipeTransform<any, boolean | undefined> {
    constructor (private readonly parameterName: string) {}

    public transform (query: any): boolean | undefined {
        if (!query) {
            return undefined;
        }
        if (query[this.parameterName] === 'true') {
            return true;
        }

        return query[this.parameterName] === 'false' ? false : undefined;
    }
}
