import * as axios from 'axios';
import {USER_AGENT} from './constants';
import {Environments} from './environments/environments';

export async function onApplicationInit (): Promise<void> {
    if (Environments.isProd()) {
        const profiler = await import('@google-cloud/profiler');
        const tracer = await import('@google-cloud/trace-agent');

        const gcpMonitoringContext: any = {
            serviceContext: {
                service: Environments.getPackageJson().name,
                version: Environments.getVersion(),
            },
        };

        tracer.start(gcpMonitoringContext);
        profiler.start(gcpMonitoringContext)
            .then((): void => {
                console.log('profiler started');
            });
    }
    (<any> axios).defaults.headers.common['user-agent'] = USER_AGENT;
}
