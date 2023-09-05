import {BadRequestException, ValidationError} from '@nestjs/common';
import * as jsonStringifySafe from 'json-stringify-safe';
import {Logger} from '../logger/logger';

export type ValidationExceptionFactory = (errors: ValidationError[]) => void;

export function createValidationExceptionFactory (message: string): ValidationExceptionFactory {
    const logger: Logger = new Logger();

    return (errors: ValidationError[]): void => {
        logger.error(`${message} Errors: ${jsonStringifySafe(errors)}`);

        throw new BadRequestException('Validation failed');
    };
}
