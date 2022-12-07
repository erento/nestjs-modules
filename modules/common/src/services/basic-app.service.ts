import {Injectable} from '@nestjs/common';
import {Logger} from '../logger/logger';
import {BaseAppService} from './base-app.service';

@Injectable()
export class BasicAppService extends BaseAppService {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor (logger: Logger) {
        super(logger);
    }
}
