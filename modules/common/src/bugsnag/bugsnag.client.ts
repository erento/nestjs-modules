import {Breadcrumb, Client, Event} from '@bugsnag/js';
import {Injectable} from '@nestjs/common';
import {BugsnagSeverity} from './interfaces';

interface NotifyPayload {
    context?: Error['stack'];
    severity: BugsnagSeverity;
    breadcrumbs?: Breadcrumb[];
    metaData: any;
}

@Injectable()
export class BugsnagClient {
    constructor (public client: Client) {}

    public notifyWithMetaData (err: Error, payload: NotifyPayload): void {
        this.client.notify(
            err,
            (event: Event): void => {
                event.severity = <any> payload.severity;
                event.breadcrumbs = payload.breadcrumbs || [];
                event.context = payload.context ?? err.stack;
                event.addMetadata('metaData', payload.metaData);
            },
       );
    }

    public getPlugin (plugin: string): ReturnType<Client['getPlugin']> {
        return this.client.getPlugin(plugin);
    }
}
