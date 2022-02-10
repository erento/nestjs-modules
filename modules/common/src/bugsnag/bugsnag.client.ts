import {Breadcrumb, Client, Event} from '@bugsnag/js';
import {Injectable} from '@nestjs/common';
import {BugsnagSeverity} from './interfaces';

interface NotifyPayload {
    context?: Error['stack'];
    severity: BugsnagSeverity;
    breadcrumbs?: Breadcrumb[];
    metadata: any;
}

@Injectable()
export class BugsnagClient {
    constructor (public client: Client) {}

    public notifyWithMetadata (err: Error, payload: NotifyPayload): void {
        this.client.notify(
            err,
            (event: Event): void => {
                event.severity = <any> payload.severity;
                event.breadcrumbs = payload.breadcrumbs || [];
                event.context = payload.context ?? err.stack;
                event.addMetadata('metadata', payload.metadata);
            },
        );
    }

    public getPlugin (plugin: string): ReturnType<Client['getPlugin']> {
        return this.client.getPlugin(plugin);
    }
}
