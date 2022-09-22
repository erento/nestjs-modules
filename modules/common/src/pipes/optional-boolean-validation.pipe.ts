import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class OptionalBooleanValidationPipe implements PipeTransform {
    public transform (value: string | undefined): boolean | undefined {
        switch (value) {
            case undefined:
                return undefined;
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                throw new Error(`value is not a boolean: '${value}'`);
        }
    }
}
