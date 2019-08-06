import {Injectable} from '@nestjs/common';
import * as hash from 'object-hash';
import * as os from 'os';
import {PubsubMessage} from './domain';

@Injectable()
export class PubsubHelper {
    public prepareForPubsub <T> (topicName: string, body: T, source: string = os.hostname()): PubsubMessage<T> {
        return {
            meta: {
                created: new Date().toISOString(),
                id: hash(body),
                source,
                type: topicName,
                version: 'v2',
            },
            payload: body,
        };
    }
}
