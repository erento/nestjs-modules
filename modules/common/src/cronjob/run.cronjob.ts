import {INestApplication} from '@nestjs/common';
import {cronJobs} from './cronjobs.store';
import {CronJobMethodReference} from './interfaces';

export function runCronJobByName (app: INestApplication, name: string): Promise<void> {
    const cronJobRef: CronJobMethodReference | undefined = cronJobs.get(name);
    if (cronJobRef) {
        const service: Object = app.get(cronJobRef.target.constructor);
        if (typeof service[cronJobRef.methodName] === 'function') {
            return service[cronJobRef.methodName]();
        }
    }

    throw new Error(`CronJob not found by name "${name}"`);
}
