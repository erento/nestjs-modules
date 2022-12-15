import {applyDecorators, SetMetadata} from '@nestjs/common';
import {bugsnagIgnoredExceptions} from './consts';

export function BugsnagIgnoreExceptions (exceptions: any[]): MethodDecorator {
    return applyDecorators(
        SetMetadata(bugsnagIgnoredExceptions, exceptions),
    );
}
