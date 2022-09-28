import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class StringListValidationPipe implements PipeTransform {
    public transform (list: string | undefined): string[] {
        if (list === undefined) {
            return [];
        }
        const result: string[] = list.split(',');

        return result.filter((value: string): boolean => !!value);
    }
}
