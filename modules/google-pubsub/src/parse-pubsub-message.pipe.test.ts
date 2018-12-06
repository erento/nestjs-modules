import {PubsubService} from './pubsub.service';
import {PushMessage} from './domain';
import {ParsePubsubMessagePipe} from './parse-pubsub-message.pipe';
import {BadRequestException, HttpException} from '@nestjs/common';

describe('ParsePubsubMessagePipe', () => {
    let mockPubsubService: PubsubService;
    let parsePubsubMessagePipe: ParsePubsubMessagePipe<string>;

    beforeEach(() => {
        mockPubsubService = <any> {
            decryptMessage: jest.fn().mockReturnValue('{}'),
            verifyMessage: jest.fn().mockReturnValue(true),
        };
        parsePubsubMessagePipe = new ParsePubsubMessagePipe(mockPubsubService);
    });

    test('transform should verify the signature', async () => {
        const stubPushMessage: PushMessage = <any> {message: 'some-string'};
        await parsePubsubMessagePipe.transform(stubPushMessage);

        expect(mockPubsubService.verifyMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.verifyMessage).toHaveBeenCalledWith(stubPushMessage.message);
    });

    test('transform should throw an HttpException if signature fails', async () => {
        (<jest.Mock> mockPubsubService.verifyMessage).mockReturnValueOnce(false);

        await expect(parsePubsubMessagePipe.transform(<any> {message: 'some-string'})).rejects.toThrow(HttpException);
    });

    test('transform should return the decrypted message and parse it', async () => {
        const mockMessagePayload: any = {mock: true};
        (<jest.Mock> mockPubsubService.decryptMessage).mockReturnValueOnce(JSON.stringify(mockMessagePayload));

        const result: any = await parsePubsubMessagePipe.transform(<any> {message: ''});

        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
        expect(result).toEqual(mockMessagePayload);
    });

    test('transform should throw BadRequestException if it fails during decryption', async () => {
        (<jest.Mock> mockPubsubService.decryptMessage).mockReset();
        (<jest.Mock> mockPubsubService.decryptMessage).mockRejectedValueOnce(new Error('Could not decrypt'));

        await expect(parsePubsubMessagePipe.transform(<any> {message: ''})).rejects.toThrow(BadRequestException);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
    });

    test('transform should throw a BadRequestException if the message cannot be parsed', async () => {
        (<jest.Mock> mockPubsubService.decryptMessage).mockReturnValueOnce('{GoodLuck}Parsing{this}[thing]');

        await expect(parsePubsubMessagePipe.transform(<any> {message: ''})).rejects.toThrow(BadRequestException);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
    });

});
