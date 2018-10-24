import {GCloudConfiguration} from '@google-cloud/pubsub';
import {DynamicModule, Module, Provider} from '@nestjs/common';
import {PubsubService} from './pubsub.service';
import {PubsubHelper} from './pubsub.helper';

@Module({})
export class PubsubModule {
    public static forRoot (
        configFile: GCloudConfiguration,
        cryptoSignKey: string,
        cryptoEncryptionKey: string,
        serviceIdentifier: string,
    ): DynamicModule {
        const providers: Provider[] = [
            PubsubHelper,
            {
                provide: PubsubService,
                useFactory: async (pubsubHelper: PubsubHelper): Promise<PubsubService> => PubsubService.create(
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
