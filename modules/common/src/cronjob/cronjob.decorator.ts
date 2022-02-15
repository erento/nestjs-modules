import {cronJobs} from './cronjobs.store';

export function CronJob (name: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        if (
            typeof propertyKey === 'string' &&
            target.hasOwnProperty(propertyKey) &&
            typeof target[propertyKey] === 'function'
        ) {
            cronJobs.set(name, {target, methodName: propertyKey});

            return;
        }

        throw new TypeError('Attempting to add CronJob decorator on an invalid property.');
    };
}
