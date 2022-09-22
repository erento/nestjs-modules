import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class RadiusValidationPipe implements PipeTransform {
    public transform (value: string | undefined): number | undefined {
        if (value !== undefined) {
            const integer: number = parseInt(value, 10) || 0;

            return integer > 0 ? integer : undefined;
        }

        return undefined;
    }
}
