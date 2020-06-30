/* tslint:disable:variable-name */
import {applyDecorators, Header} from '@nestjs/common';
type DecoratorFunction = (...args: any[]) => MethodDecorator;

export const PrivateCache: DecoratorFunction = (): MethodDecorator => applyDecorators(
    Header('Cache-Control', 'private'),
    Header('Surrogate-Control', 'private'),
);

export const CacheForSeconds: DecoratorFunction = (duration: number): MethodDecorator => applyDecorators(
    Header('Cache-Control', `max-age=${duration}`),
);
