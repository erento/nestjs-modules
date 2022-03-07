import * as aws from 'aws-sdk';
import {S3MoveFileError, S3MoveFileErrorCode} from './errors/s3-move-file.error';
import {S3Client} from './s3.client';

let connection: aws.S3;

type VariadicCallback = (...args: any[]) => void;

/* eslint-disable @typescript-eslint/unbound-method */
describe('S3 Client', (): void => {
    beforeEach((): void => {
        connection = <any> {
            copyObject: jest.fn(),
            deleteObject: jest.fn(),
            getSignedUrl: jest.fn(),
            headObject: jest.fn(),
            upload: jest.fn(),
        };
    });

    describe('upload', (): void => {
        test('should skip path prefix when empty', (): void => {
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

    describe('fileExists', (): void => {
        test('it throws if there is an unknown error', async (): Promise<void> => {
            (<jest.Mock> connection.headObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(new Error('Test')));

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.fileExists('some-object.txt')).rejects.toThrowError('Test');
        });

        test('it returns false if object is not found', async (): Promise<void> => {
            (<jest.Mock> connection.headObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback({statusCode: 404}));

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.fileExists('some-object.txt')).resolves.toBe(false);
        });

        test('it returns true if metadata is returned', async (): Promise<void> => {
            (<jest.Mock> connection.headObject).mockImplementation(
                (_: never, callback: VariadicCallback): void => callback(undefined, {ObjectName: 'yay'}),
            );

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.fileExists('some-object.txt')).resolves.toBe(true);

            expect(connection.headObject).toHaveBeenCalledWith(
                {Key: 'some-prefix/some-object.txt', Bucket: 'my-bucket-name'},
                expect.any(Function),
            );
        });
    });

    describe('moveWithinBucket', (): void => {
        test('it throws if there is an error with copying', async (): Promise<void> => {
            (<jest.Mock> connection.copyObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(new Error('Test')));

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.moveWithinBucket('some-object.txt', 'some-other-object.txt'))
                .rejects.toThrowError(new S3MoveFileError(S3MoveFileErrorCode.CopyFailed));
            expect(connection.deleteObject).not.toHaveBeenCalled();
        });

        test('it copies object from source to target and deletes original', async (): Promise<void> => {
            const stubOutput: aws.S3.CopyObjectOutput = <any> {};
            (<jest.Mock> connection.copyObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(undefined, stubOutput));
            (<jest.Mock> connection.deleteObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(undefined));

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.moveWithinBucket('some-object.txt', 'some-other-object.txt')).resolves.toBe(stubOutput);

            expect(connection.copyObject).toHaveBeenCalledWith(
                {
                    CopySource: 'my-bucket-name/some-prefix/some-object.txt',
                    Key: 'some-prefix/some-other-object.txt',
                    Bucket: 'my-bucket-name',
                },
                expect.any(Function),
            );
            expect(connection.deleteObject).toHaveBeenCalledWith(
                {Key: 'some-prefix/some-object.txt', Bucket: 'my-bucket-name'},
                expect.any(Function),
            );
        });

        test('it throws if copy succeeds but delete fails', async (): Promise<void> => {
            const stubOutput: aws.S3.CopyObjectOutput = <any> {};
            const stubError: aws.AWSError = <any> {};
            (<jest.Mock> connection.copyObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(undefined, stubOutput));
            (<jest.Mock> connection.deleteObject)
                .mockImplementation((_: never, callback: VariadicCallback): void => callback(stubError));

            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');
            await expect(s3Client.moveWithinBucket('some-object.txt', 'some-other-object.txt'))
                .rejects.toThrowError(new S3MoveFileError(S3MoveFileErrorCode.DeleteFailed));

            expect(connection.copyObject).toHaveBeenCalledWith(
                {
                    CopySource: 'my-bucket-name/some-prefix/some-object.txt',
                    Key: 'some-prefix/some-other-object.txt',
                    Bucket: 'my-bucket-name',
                },
                expect.any(Function),
            );
            expect(connection.deleteObject).toHaveBeenCalledWith(
                {Key: 'some-prefix/some-object.txt', Bucket: 'my-bucket-name'},
                expect.any(Function),
            );
        });
    });

    describe('getEphemeralSignedFileUrl', (): void => {
        test('it generates a getObject signed url', (): void => {
            const s3Client: S3Client = new S3Client(connection, 'my-bucket-name', 'some-prefix');

            s3Client.getEphemeralSignedFileUrl('some-object.txt', 60);

            expect(connection.getSignedUrl).toHaveBeenCalledWith(
                'getObject',
                {
                    Key: 'some-prefix/some-object.txt',
                    Bucket: 'my-bucket-name',
                    Expires: 60,
                },
            );
        });
    });
});
