const mockPublish: jest.Mock = jest.fn();

class StupPubSub {
    public topic (): any {
        return {
            publish: mockPublish,
        };
    }
}

jest.mock('@google-cloud/pubsub', () => {
    return {
        PubSub: StupPubSub,
    };
});

import {PubsubHelper} from './pubsub.helper';
import {PubsubService} from './pubsub.service';

describe('pubsub service', (): void => {
    let pubsubHelper: PubsubHelper;
    let service: PubsubService;

    beforeEach((): void => {
        pubsubHelper = <any> {prepareForPubsub: jest.fn()};
        jest.spyOn(pubsubHelper, 'prepareForPubsub').mockImplementationOnce(() => {
            return {
                meta: {created: new Date().toISOString(), id: 'asd123', source: 'source', type: 'topicName', version: 'v2'},
                payload: 'some body',
            };
        });

        service = PubsubService.create(
            {},
            'cryptoEncryptionKey',
            'cryptoSignKey',
            pubsubHelper,
            'userAgent',
        );
    });

    test('should throw if message is empty', async (): Promise<void> => {
        await expect(service.publishMessage('slack', undefined))
            .rejects
            .toBeInstanceOf(Error);
    });

    test('should call the publish method on the underlying pub-sub library', async (): Promise<void> => {
        await expect(service.publishMessage('slack', 'mockmsg')).resolves.toBeUndefined();
        expect(mockPublish).toBeCalledWith(expect.any(Buffer), {signature: expect.anything()});
        /* eslint-disable-next-line @typescript-eslint/unbound-method */
        expect(pubsubHelper.prepareForPubsub).toBeCalledWith('slack', 'mockmsg', 'userAgent');
    });
});
