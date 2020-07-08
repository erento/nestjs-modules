import {Client, Event} from '@bugsnag/js';
import {Injectable} from '@nestjs/common';
import {BugsnagSeverity} from './interfaces';

interface NotifyPayload {
    context?: Error['stack'];
    severity: BugsnagSeverity;
    metaData: any;
}

@Injectable()
export class BugsnagClient {
    constructor (public client: Client) {}

    public notifyWithMeta (err: Error, payload: NotifyPayload): void {
        this.client.notify(
            err,
            (event: Event): void => {
                event.severity = <any> payload.severity;
                event.context = payload.context ? payload.context : err.stack;
                event.addMetadata('metaData', payload.metaData);
            },
       );
    }

    public getPlugin (plugin: string): ReturnType<Client['getPlugin']> {
        return this.client.getPlugin(plugin);
    }
}
