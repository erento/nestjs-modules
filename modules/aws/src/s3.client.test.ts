import {S3Client} from './s3.client';

import * as aws from 'aws-sdk';

let connection: aws.S3;

/* tslint:disable:no-unbound-method */
describe('S3 Client', (): void => {
    beforeEach((): void => {
        connection = <any> {
            upload: jest.fn(),
        };
    });

    describe('upload', (): void => {
        test('should skip path prefix when empty', async (): Promise<void> => {
            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', '');

            // intentionally not awaiting because of a callback handler
            s3Client.upload('folder/filename.jpg', 'payload', {leavePartsOnError: true});

            expect(connection.upload).toHaveBeenCalledWith(
                {Body: 'payload', Bucket: 'my-bucket-name', Key: 'folder/filename.jpg'},
                {leavePartsOnError: true},
                expect.any(Function),
            );
        });

        test('should use path prefix', (): void => {
            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');

            // intentionally not awaiting because of a callback handler
            s3Client.upload('folder/filename.jpg', 'payload');

            expect(connection.upload).toHaveBeenCalledWith(
                {Body: 'payload', Bucket: 'my-bucket-name', Key: 'some-prefix/folder/filename.jpg'},
                {},
                expect.any(Function),
            );
        });
    });

    describe('uploadInBatch', (): void => {
        test.each([[[]], [null], [undefined], [''], [{a: 1}]])(
            'should fail if a list of objects is invalid',
            (...input: any): void => {
                const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');

                expect(() => s3Client.uploadInBatch('folder/filename.jpg', input[0]))
                    .toThrowError('You are trying to upload an empty file.');
                expect(connection.upload).not.toHaveBeenCalled();
            },
        );

        test('should merge object in one string payload', (): void => {
            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');

            // intentionally not awaiting because of a callback handler
            s3Client.uploadInBatch('folder/filename.jpg', [{a: 1}, {b: {c: 2}}]);

            expect(connection.upload).toHaveBeenCalledWith(
                {Body: '{"a":1}\n{"b":{"c":2}}', Bucket: 'my-bucket-name', Key: 'some-prefix/folder/filename.jpg'},
                {},
                expect.any(Function),
            );
        });
    });
});
