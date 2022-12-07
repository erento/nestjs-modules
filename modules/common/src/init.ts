import {start as profilerStart} from '@google-cloud/profiler';
import {Config, start as traceStart} from '@google-cloud/trace-agent';
import * as axios from 'axios';
import {USER_AGENT} from './constants';
import {Environments} from './environments/environments';

const gcpMonitoringContext: Config = {
    serviceContext: {
        service: Environments.getPackageJson().name,
        version: Environments.getVersion(),
    },
};

export function onApplicationInit (): void {
    traceStart(gcpMonitoringContext);
    profilerStart(gcpMonitoringContext)
        .then((): void => {
            console.log('profiler started');
        });

    (<any> axios).defaults.headers.common['user-agent'] = USER_AGENT;
}
