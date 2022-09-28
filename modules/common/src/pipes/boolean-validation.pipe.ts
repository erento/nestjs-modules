import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class BooleanValidationPipe implements PipeTransform {
    public transform (value: string | undefined): boolean | undefined {
        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return false;
        }
    }
}
