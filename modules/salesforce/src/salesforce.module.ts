import {Module} from '@nestjs/common';
import {OutboundMessagesParser} from './outbound-messages.parser';

@Module({
    providers: [OutboundMessagesParser],
    exports: [OutboundMessagesParser],
})
export class SalesforceModule {}
