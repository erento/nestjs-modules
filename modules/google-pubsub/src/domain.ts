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

interface CredentialBody {
    client_email?: string;
    private_key?: string;
}

// this type is not exported on `@google-cloud/pubsub`
export interface GoogleAuthOptions {
    /** Path to a .json, .pem, or .p12 key file */
    keyFilename?: string;
    /** Path to a .json, .pem, or .p12 key file */
    keyFile?: string;
    credentials?: CredentialBody;
    /** Required scopes for the desired API request */
    scopes?: string | string[];
    projectId?: string;
}
