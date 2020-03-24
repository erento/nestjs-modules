import {PubSub, Topic} from '@google-cloud/pubsub';
import {ClientConfig} from '@google-cloud/pubsub/build/src/pubsub';
import {Injectable} from '@nestjs/common';
import * as MessageCrypto from 'message-crypto';
import {EncodedMessage, PublishOptions, Subscription, SubscriptionOptions} from './domain';
import {PubsubHelper} from './pubsub.helper';

@Injectable()
export class PubsubService {
    public static async create (
        clientConfig: ClientConfig,
        cryptoEncryptionKey: string,
        cryptoSignKey: string,
        pubSubHelper: PubsubHelper,
        serviceIdentifier: string,
    ): Promise<PubsubService> {
        const pubSubService: PubsubService = new PubsubService(cryptoEncryptionKey, cryptoSignKey, pubSubHelper, serviceIdentifier);
        await pubSubService.initPubSubLibrary(clientConfig);
        return pubSubService;
    }

    private pubSubLibrary: PubSub | undefined;

    constructor (
        private readonly cryptoEncryptionKey: string,
        private readonly cryptoSignKey: string,
        private readonly pubsubHelper: PubsubHelper,
        private readonly serviceIdentifier: string,
    ) {}

    public listenOnSubscription (
        subscriptionName: string,
        onMessage: (...args: any[]) => void,
        onError: (...args: any[]) => void,
        options?: SubscriptionOptions,
    ): Subscription {
        if (!this.pubSubLibrary) {
            throw new Error('There is no Pub/Sub library. Cannot return a subscription.');
        }

        const subscription: Subscription = this.pubSubLibrary.subscription(subscriptionName, options);
        subscription.on('message', onMessage);
        subscription.on('error', onError);

        return subscription;
    }

    public decryptMessage <T = string> (body: EncodedMessage): Promise<T> {
        const message: Buffer | undefined = body && body.data || undefined;

        return MessageCrypto.decrypt(message, this.cryptoEncryptionKey);
    }

    public async verifyMessage (body: EncodedMessage): Promise<boolean> {
        try {
            const signature: string | undefined = body.attributes.signature || undefined;
            let message: any = body.data || undefined;

            if (message instanceof Buffer) {
                message = message.toString('base64');
            }

            return true === await MessageCrypto.verifySignature(message, this.cryptoSignKey, signature);
        } catch {
            throw new Error('Message signature check failed.');
        }
    }

    public async publishMessage <T> (
        topicName: string,
        message: T,
        attributes: {[key: string]: string} = {},
        encrypted: boolean = true,
        publishOptions?: PublishOptions,
    ): Promise<void> {
        if (!message) {
            throw new Error('Message can\'t be empty.');
        }

        const messageWithMetadata: string = JSON.stringify(
            this.pubsubHelper.prepareForPubsub<T>(topicName, message, this.serviceIdentifier),
        );
        const messageBody: string = encrypted ?
            await this.encryptMessage(messageWithMetadata) :
            Buffer.from(messageWithMetadata).toString('base64');

        const signature: string = await this.createSignature(messageBody);

        await this.getTopic(topicName, publishOptions).publish(
            Buffer.from(messageBody, 'base64'),
            {
                signature,
                ...attributes,
            },
        );
    }

    public createSignature (b64Body: string): Promise<string> {
        return MessageCrypto.createSignature(b64Body, this.cryptoSignKey);
    }

    public encryptMessage (message: string): Promise<string> {
        return MessageCrypto.encrypt(message, this.cryptoEncryptionKey);
    }

    private async initPubSubLibrary (googleClientConfig: ClientConfig): Promise<void> {
        if (!this.pubSubLibrary) {
            this.pubSubLibrary = new PubSub(googleClientConfig);
        }
    }

    private getTopic (topicName: string, publishOptions?: PublishOptions): Topic {
        if (!this.pubSubLibrary) {
            throw new Error('There is no Pub/Sub library. Cannot return a topic.');
        }

        try {
            return this.pubSubLibrary.topic(topicName, publishOptions);
        } catch (err) {
            throw new Error('Cannot get a publisher.');
        }
    }
}
