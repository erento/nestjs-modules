import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class OptionalIntValidationPipe implements PipeTransform {
    public transform (value: string | undefined): number | undefined {
        if (value === undefined) {
            return undefined;
        }
        const result: number = parseInt(value, 10);
        if (isNaN(result)) {
            throw new Error(`Value is not a number: '${value}'`);
        }

        return result;
    }
}
