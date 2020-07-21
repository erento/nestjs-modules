import {Module, Provider} from '@nestjs/common';
import {AuthorizationGuard} from './authorization.guard';

const providers: Provider[] = [
    AuthorizationGuard,
];

@Module({
    providers: [...providers],
    exports: [...providers],
})
export class GuardsModule {}
