import Bugsnag, {Config} from '@bugsnag/js';
import {DynamicModule, Module} from '@nestjs/common';
import {BugsnagClient} from './bugsnag.client';

@Module({
    providers: [
        {
            provide: BugsnagClient,
            useFactory: (): Promise<BugsnagClient> => Promise.resolve(BugsnagModule.providedClient),
        },
    ],
    exports: [BugsnagClient],
})
export class BugsnagModule {
    public static providedClient: BugsnagClient;

    public static forRoot (bugsnagConfig: Config): DynamicModule {
        return {
            module: BugsnagModule,
            providers: [
                {
                    provide: BugsnagClient,
                    useFactory: (): BugsnagClient => {
                        BugsnagModule.providedClient = new BugsnagClient(Bugsnag.createClient(bugsnagConfig));

                        return BugsnagModule.providedClient;
                    },
                },
            ],
        };
    }
}
