import {ClientConfig} from '@google-cloud/pubsub/build/src/pubsub';
import {DynamicModule, Module, Provider} from '@nestjs/common';
import {ParsePubsubMessagePipe} from './parse-pubsub-message.pipe';
import {PubsubHelper} from './pubsub.helper';
import {PubsubService} from './pubsub.service';

@Module({})
export class PubsubModule {
    public static forRoot (
        configFile: ClientConfig,
        cryptoSignKey: string,
        cryptoEncryptionKey: string,
        serviceIdentifier: string,
    ): DynamicModule {
        const providers: Provider[] = [
            ParsePubsubMessagePipe,
            PubsubHelper,
            {
                provide: PubsubService,
                useFactory: (pubsubHelper: PubsubHelper): PubsubService => PubsubService.create(
                    configFile,
                    cryptoEncryptionKey,
                    cryptoSignKey,
                    pubsubHelper,
                    serviceIdentifier,
                ),
                inject: [PubsubHelper],
            },
        ];

        return {
            module: PubsubModule,
            providers,
            exports: providers,
        };
    }
}
