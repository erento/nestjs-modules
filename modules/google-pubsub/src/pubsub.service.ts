import {Injectable} from '@nestjs/common';
import {GCloudConfiguration, Publisher, PubSub, Subscription} from '@google-cloud/pubsub';
import * as MessageCrypto from 'message-crypto';
import {PubsubHelper} from './pubsub.helper';
import {EncodedMessage} from './domain';

@Injectable()
export class PubsubService {
    public static async create (
        configFile: GCloudConfiguration,
        cryptoEncryptionKey: string,
        cryptoSignKey: string,
        pubSubHelper: PubsubHelper,
        serviceIdentifier: string,
    ): Promise<PubsubService> {
        const pubSubService: PubsubService = new PubsubService(cryptoEncryptionKey, cryptoSignKey, pubSubHelper, serviceIdentifier);
        await pubSubService.initPubSubLibrary(configFile);
        return pubSubService;
    }

    private pubSubLibrary: PubSub | undefined;

    constructor (
        private readonly cryptoEncryptionKey: string,
        private readonly cryptoSignKey: string,
        private readonly pubsubHelper: PubsubHelper,
        private readonly serviceIdentifier: string,
    ) {}

    public listenOnSubscription (subscriptionName: string, onMessage: (...args: any[]) => void, onError: (...args: any[]) => void): void {
        if (!this.pubSubLibrary) {
            throw new Error('There is no Pub/Sub library. Cannot return a subscription.');
        }

        const subscription: Subscription = this.pubSubLibrary.subscription(subscriptionName);
        subscription.on('message', onMessage);
        subscription.on('error', onError);
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

    public async publishMessage <T> (topicName: string, message: T, attributes: {[key: string]: string} = {}): Promise<string> {
        if (!message) {
            throw new Error('Message can\'t be empty.');
        }

        const messageWithMetadata: string = JSON.stringify(
            this.pubsubHelper.prepareForPubsub<T>(topicName, message, this.serviceIdentifier),
        );
        const b64Body: string = await this.encryptMessage(messageWithMetadata);
        const signature: string = await this.createSignature(b64Body);

        return this.getPublisher(topicName).publish(
            Buffer.from(b64Body, 'base64'),
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

    private async initPubSubLibrary (config: GCloudConfiguration): Promise<void> {
        if (!this.pubSubLibrary) {
            const pubSub: (config: GCloudConfiguration) => PubSub = await import('@google-cloud/pubsub');
            this.pubSubLibrary = pubSub(config);
        }
    }

    private getPublisher (topicName: string): Publisher {
        if (!this.pubSubLibrary) {
            throw new Error('There is no Pub/Sub library. Cannot return a publisher.');
        }

        try {
            return this.pubSubLibrary.topic(topicName).publisher();
        } catch (err) {
            throw new Error('Cannot get a publisher.');
        }
    }
}
