import {Injectable} from '@nestjs/common';

interface MessageBodyNotification<T> {
    id: string[];
    sobject: T[];
}

type MessageBodyNotificationList<T> = MessageBodyNotification<T>[];

interface MessageBody<T> {
    notifications: {
        $: {
            xmlns: string;
        };
        organizationid: string[];
        actionid: string[];
        sessionid: string[];
        enterpriseurl: string[];
        partnerurl: string[];
        notification: MessageBodyNotificationList<T>;
    };
}

type MessageBodyList<T> = MessageBody<T>[];

interface OutboundMessage<T> {
    'soapenv:envelope': {
        $: {
            'xmlns:soapenv': string;
            'xmlns:xsd': string;
            'xmlns:xsi': string;
        };
        'soapenv:body': MessageBodyList<T>;
    };
}

export type SalesforceObject = {
    $: {
        'xsi:type': string;
        'xmlns:sf': string;
    };
} & {
    [key: string]: string[];
};

@Injectable()
export class OutboundMessagesParser {
    public parse <R> (xmlAsJson: object, type: string, transformer: (input: SalesforceObject) => R): R[] {
        try {
            const payload: OutboundMessage<R> = <any> xmlAsJson;
            const body: MessageBodyList<R> = payload['soapenv:envelope']['soapenv:body'];
            const notificationList: MessageBodyNotificationList<SalesforceObject> = body[0].notifications[0].notification;

            const messages: R[] = [];
            notificationList.forEach((notification: MessageBodyNotification<SalesforceObject>): void => {
                notification.sobject.forEach((sObject: SalesforceObject): void => {
                    if (type === sObject.$['xsi:type']) {
                        messages.push(
                            transformer(sObject),
                        );
                    }
                });
            });

            return messages;
        } catch (e: any) {
            e.message = `Couldn't parse an outbound message. Original message: ${e.message}.`;
            throw e;
        }
    }
}
