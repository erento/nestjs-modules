import {applyDecorators, SetMetadata} from '@nestjs/common';
import {SILENT_FAIL_TOKEN} from '../guards/consts';

export function BugsnagIgnoreExceptions (exceptions: any[]): MethodDecorator {
    return applyDecorators(
        SetMetadata(SILENT_FAIL_TOKEN, exceptions),
    );
}
