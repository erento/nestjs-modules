import {PubsubService} from './pubsub.service';
import {PushMessage} from './domain';
import {ParsePubsubMessagePipe} from './parse-pubsub-message.pipe';
import {BadRequestException, HttpException} from '@nestjs/common';

describe('ParsePubsubMessagePipe', (): void => {
    let mockPubsubService: PubsubService;
    let parsePubsubMessagePipe: ParsePubsubMessagePipe<string>;

    beforeEach((): void => {
        mockPubsubService = <any> {
            decryptMessage: jest.fn(),
            verifyMessage: jest.fn(),
        };
        parsePubsubMessagePipe = new ParsePubsubMessagePipe(mockPubsubService);
    });

    test('should verify the signature', async (): Promise<void> => {
        (<jest.Mock> mockPubsubService.verifyMessage).mockResolvedValueOnce(true);
        (<jest.Mock> mockPubsubService.decryptMessage).mockResolvedValueOnce('{}');

        const stubPushMessage: PushMessage = <any> {message: 'some-string'};
        await parsePubsubMessagePipe.transform(stubPushMessage);

        expect(mockPubsubService.verifyMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.verifyMessage).toHaveBeenCalledWith(stubPushMessage.message);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith(stubPushMessage.message);
    });

    test('should throw an HttpException if signature fails', async (): Promise<void> => {
        (<jest.Mock> mockPubsubService.verifyMessage).mockReturnValueOnce(false);

        await expect(parsePubsubMessagePipe.transform(<any> {message: 'some-string'})).rejects.toThrow(HttpException);
        expect(mockPubsubService.verifyMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).not.toHaveBeenCalled();
    });

    test('should return the decrypted message and parse it', async (): Promise<void> => {
        const mockMessagePayload: any = {mock: true};
        (<jest.Mock> mockPubsubService.verifyMessage).mockResolvedValueOnce(true);
        (<jest.Mock> mockPubsubService.decryptMessage).mockResolvedValueOnce(JSON.stringify(mockMessagePayload));

        const result: any = await parsePubsubMessagePipe.transform(<any> {message: ''});

        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
        expect(result).toEqual(mockMessagePayload);
    });

    test('should throw BadRequestException if it fails during decryption', async (): Promise<void> => {
        (<jest.Mock> mockPubsubService.verifyMessage).mockResolvedValueOnce(true);
        (<jest.Mock> mockPubsubService.decryptMessage).mockRejectedValueOnce(new Error('Could not decrypt'));

        await expect(parsePubsubMessagePipe.transform(<any> {message: ''})).rejects.toThrow(BadRequestException);
        expect(mockPubsubService.verifyMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
    });

    test('should throw a BadRequestException if the message cannot be parsed', async (): Promise<void> => {
        (<jest.Mock> mockPubsubService.verifyMessage).mockResolvedValueOnce(true);
        (<jest.Mock> mockPubsubService.decryptMessage).mockResolvedValueOnce('{GoodLuck}Parsing{this}[thing]');

        await expect(parsePubsubMessagePipe.transform(<any> {message: ''})).rejects.toThrow(BadRequestException);
        expect(mockPubsubService.verifyMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledTimes(1);
        expect(mockPubsubService.decryptMessage).toHaveBeenCalledWith('');
    });
});
