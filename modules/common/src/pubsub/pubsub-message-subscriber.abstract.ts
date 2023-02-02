import {
    EncodedMessage,
    PubsubMessage,
    PubsubMessageMeta,
    PubsubService,
    Subscription,
    SubscriptionOptions,
} from '@erento/nestjs-module-google-pubsub';
import * as httpContext from 'express-http-context';
import * as jsonStringifySafe from 'json-stringify-safe';
import {delay, filter} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {REQUEST_UNIQUE_ID_KEY} from '../constants';
import {Logger} from '../logger/logger';
import {BasicAppService} from '../services/basic-app.service';
import {DELAY_AFTER_STARTUP, SKIP_DEADLINE} from './consts';
import {NackSilentError} from './nack-silent.error';

export abstract class PubSubMessageSubscriber<TMsgBody, TAppSvc extends BasicAppService> {
    private topicName: string | undefined;
    private pubsubSubscription: Subscription | undefined;

    protected constructor (
        protected readonly appService: TAppSvc,
        protected readonly logger: Logger,
        protected readonly pubsubService: PubsubService,
        protected readonly cronjobName?: string | undefined,
        protected readonly disableSubscription: boolean = false,
    ) {}

    protected subscribeToPubSub (
        subscriptionName: string,
        topicName: string,
        options?: SubscriptionOptions,
        cronJobName?: string,
        encrypted: boolean = true,
    ): void {
        if (!topicName || !subscriptionName) {
            throw new Error(`Topic & subscription name have to be provided to subscribe to Pub/Sub pull subscription.`);
        }

        if (cronJobName !== this.cronjobName) {
            this.logger.log(`Not subscribing to "${topicName}" while running a cron job.`);

            return;
        }

        this.topicName = topicName;

        this.appService
            .hasStarted()
            .pipe(
                delay(DELAY_AFTER_STARTUP),
                filter((val: boolean): boolean => val && !this.disableSubscription),
            )
            .subscribe((): void => {
                this.logger.log(`Pub/Sub subscription "${subscriptionName}" to "${topicName}" is listening.`);
                this.pubsubSubscription = this.pubsubService.listenOnSubscription(
                    subscriptionName,
                    this.onMessageReceived.bind(this, encrypted),
                    this.onMessageError.bind(this),
                    options,
                );

                this.appService
                    .isTerminating()
                    .pipe(
                        filter((val: boolean): boolean => val),
                    )
                    .subscribe((): void => {
                        this.unsubscribeFromPubsub();
                    });
            });
    }

    protected unsubscribeFromPubsub (): void {
        if (this.pubsubSubscription) {
            this.pubsubSubscription.removeAllListeners();
            this.logger.log(`Pub/Sub subscription to "${this.topicName}" stopped.`);
        }
    }

    private onMessageReceived (encrypted: boolean, message: EncodedMessage): void {
        this.contextify(async (): Promise<void> => {
            let parsedBody: TMsgBody | undefined;

            try {
                this.logger.log(`Processing Pub/Sub message "${message.id}".`);
                await this.pubsubService.verifyMessage(message);
                const decryptedMessage: string = await this.pubsubService.decryptMessage(message, encrypted);
                const decryptedObject: PubsubMessage<TMsgBody> = JSON.parse(decryptedMessage);
                const parsedMeta: PubsubMessageMeta = decryptedObject.meta;

                parsedBody = decryptedObject.payload;

                if (!parsedMeta.type || (this.topicName && !this.topicName.endsWith(parsedMeta.type))) {
                    this.logger.error(
                        `Unknown event type. I got: "${parsedMeta.type}" and it should be "${this.topicName}". ` +
                        `Skipping the message. Message was: "${jsonStringifySafe(parsedBody)}"`,
                    );
                    message.ack();

                    return;
                }

                await this.handleRequest(parsedBody, parsedMeta);

                message.ack();
            } catch (e: any) {
                if (e instanceof NackSilentError) {
                    this.logger.log(`Silently nacking with message: "${e.message}"`);
                } else {
                    const errorMessage: string = e?.message || jsonStringifySafe(e);
                    this.logger.error(
                        `Failed to receive a Pub/Sub message. No ack/nack condition met, waiting for NACK skip to kick in. ` +
                        `Waiting for: ${SKIP_DEADLINE}ms. Original message: "${errorMessage}".`,
                        e?.stack,
                    );
                }

                setTimeout((): void => {
                    this.logger.log(`Nacking message "${message.id}" in the topic "${this.topicName}".`);
                    message.nack();
                }, SKIP_DEADLINE);
            }
        });
    }

    private onMessageError (err: Error): void {
        this.logger.error(`Unexpected error happened with a message: "${jsonStringifySafe(err)}".`);
    }

    private contextify (fn: () => Promise<void>): void {
        const contextful: () => Promise<void> = async (): Promise<void> => {
            httpContext.set(REQUEST_UNIQUE_ID_KEY, uuidv4());

            await fn();
        };
        httpContext.middleware(<any> undefined, <any> undefined, <any> contextful);
    }

    public abstract handleRequest (parsedBody: TMsgBody, meta: PubsubMessageMeta): Promise<void>;
}
