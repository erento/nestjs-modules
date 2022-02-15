import {cronJobs} from './cronjobs.store';

export function CronJob (name: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        if (
            typeof propertyKey === 'string' &&
            // eslint-disable-next-line no-prototype-builtins
            target.hasOwnProperty(propertyKey) &&
            typeof target[propertyKey] === 'function'
        ) {
            cronJobs.set(name, {target, methodName: propertyKey});

            return;
        }

        throw new TypeError('Attempting to add CronJob decorator on an invalid property.');
    };
}
