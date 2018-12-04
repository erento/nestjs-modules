const mockPublish: jest.Mock = jest.fn();

class StupPubSub {
    constructor(_options) {}

    public topic (): any {
        return {
            publisher: (): any => {
                return {publish: mockPublish};
            },
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

describe('pubsub service', async () => {
    let pubsubHelper: PubsubHelper;
    let service: PubsubService;
    beforeEach(async (): Promise<void> => {
        pubsubHelper = <any> {prepareForPubsub: jest.fn()};
        jest.spyOn(pubsubHelper, 'prepareForPubsub').mockImplementationOnce(() => {
            return {
                meta: {created: new Date().toISOString(), id: 'asd123', source: 'source', type: 'topicName', version: 'v2'},
                payload: 'some body',
            };
        });

        service = await PubsubService.create(
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
        const idempotencyKeyMatch: string = '__' + new Date().toISOString().substring(0, 10);
        await expect(service.publishMessage('slack', 'mockmsg'))
            .resolves
            .toContain(idempotencyKeyMatch);

        // tslint:disable-next-line
        expect(mockPublish).toBeCalledWith(
            expect.any(Buffer),
            {idempotencyKey: expect.stringContaining(idempotencyKeyMatch), signature: expect.anything()},
        );
        expect(pubsubHelper.prepareForPubsub).toBeCalledWith('slack', 'mockmsg', 'userAgent');
    });
});
