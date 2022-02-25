import {Global, Module} from '@nestjs/common';
import {BugsnagClient} from '../bugsnag/bugsnag.client';
import {BugsnagModule} from '../bugsnag/bugsnag.module';
import {Logger} from './logger';

@Global()
@Module({
    imports: [
        BugsnagModule,
    ],
    providers: [
        {
            provide: Logger,
            inject: [BugsnagClient],
            useFactory: (bugsnagClient: BugsnagClient): Logger => new Logger(bugsnagClient),
        },
    ],
    exports: [Logger],
})
export class GlobalLoggerModule {}
