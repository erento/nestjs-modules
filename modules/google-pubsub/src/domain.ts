export interface EncodedMessage {
    connectionId: string;
    ackId: string;
    id: string;
    attributes: {
        signature: string;
    };
    publishTime: string;
    received: number;
    data: Buffer;
    length: number;
    ack: Function;
    nack: Function;
}

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
