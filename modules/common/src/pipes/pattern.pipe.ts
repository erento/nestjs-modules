import {PipeTransform} from '@nestjs/common';
import {ValidationException} from '../exceptions/validation.exception';

export class PatternPipe implements PipeTransform {
    constructor (private readonly pattern: string | RegExp) {}

    public transform (value: string): string {
        const matcher: RegExp = new RegExp(this.pattern);

        if (matcher.test(value)) {
            return value;
        }

        throw new ValidationException('Value does not match the pattern.');
    }
}
