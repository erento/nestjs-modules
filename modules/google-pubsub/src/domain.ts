import {Message as gMessage, Subscription as gSubscription} from '@google-cloud/pubsub';
import {PublishOptions as gPublishOptions} from '@google-cloud/pubsub/build/src/publisher';
import {SubscriptionOptions as gSubscriptionOptions} from '@google-cloud/pubsub/build/src/subscription';

export interface PublishOptions extends gPublishOptions {}

export interface Subscription extends gSubscription {}
export interface SubscriptionOptions extends gSubscriptionOptions {}

export interface EncodedMessage extends gMessage {}

export interface PubsubMessage<T = any> {
    meta: PubsubMessageMeta;
    payload: T;
}

export interface PubsubMessageMeta {
    created: string;
    id: string;
    source: string;
    type: string;
    version: string;
}

export interface PushMessage<T = string> {
    message: {
        attributes: {
            signature: string;
            [key: string]: string;
        };
        data: T;
        messageId: string;
        message_id: string;
        publishTime: string;
        publish_time: string;
    };
    subscription: string;
}
