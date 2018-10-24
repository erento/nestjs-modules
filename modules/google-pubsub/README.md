# NestJS Google Pub/Sub module

Easy way to publish messages to Google Pub/Sub. Supports encrypting the message.

## How to use it
1. Import

    Import this module in the module you want to use it:
        ```typescript
        imports: [
            PubSubModule.forRoot(
                {keyFilename: PUBSUB_CONFIG},
                X_PUBSUB_KEY,
                X_PUBSUB_ENCRYPTION_KEY,
                SERVICE_IDENTIFIER
            )
        ]
        ```    
    
    - `PUBSUB_CONFIG` is the path to the file with the service account, e.g.: `./config/pubsub.config.json`
    - `X_PUBSUB_KEY` is a secret signature key to encrypt the message. This is necessary for write, but can be used in read operation to verify a signature. 
    - `X_PUBSUB_ENCRYPTION_KEY` is a secret encryption key. This is necessary for write and read.
    - `SERVICE_IDENTIFIER` is a string represantation of a sender, e.g. "price-service", "user-service", etc.
    
2. Usage
    
    - **Publish a messages:**
        ```typescript
        await this.pubSubService.publishMessage<MyMessage>(
            'projects/project-name/topics/topic-name',
            { // this can be any object, in this case: MyMessage
                text: `some message`,
            },
            {
                myAttribute: 'any other attribute you need to pass',
            },
        );
        ```

    - **Read a messages:**
        ```typescript
        private async onSubscriptionMessage (message: EncodedMessage): Promise<void> {
            try {
                await this.pubSubService.verifyMessage(message);
                const decryptedMessage: string = await this.pubSubService.decryptMessage(message);
                const parsedMessage: PubSubMessage<MyMessage> = JSON.parse(decryptedMessage);

                // process parsed message parsedMessage looks like: {meta: object, payload: MyMessage}

                message.ack();
            } catch (e) {
                message.nack();
            }
        }
        ```

    - **Pull for messages:**
        In constructor run `this.registerPubSubPull();`. The implementation can look as follows:

        ```typescript
        import {EncodedMessage, PubSubMessage, PubSubService} from '@erento/nestjs-module-google-pubsub';
 
        interface MyMessage {}
  
        class MyClass {
            constructor(private readonly pubSubService: PubSubService) {
                this.registerPubSubPull();
            }

            private registerPubSubPull (): void {
                this.pubSubService.listenOnSubscription(
                    'projects/project-name/subscriptions/pull-subscription-name',
                    this.onSubscriptionMessage.bind(this),
                    this.onSubscriptionError.bind(this),
                );
            }

            private async onSubscriptionMessage (message: EncodedMessage): Promise<void> {
                // see section above how to read a message
            }

            private onSubscriptionError (message: EncodedRequest): void {
                Log.error(`Unexpected error happened with a message: ${JSON.stringify(message)}`);
            }
        }
        ```

## Stay in touch

* [Erento's developers](mailto:developers@erento.com) 

## License

This module is [MIT licensed](LICENSE.md).
