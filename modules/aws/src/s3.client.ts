import {Injectable} from '@nestjs/common';
import * as aws from 'aws-sdk';
import {Body, CopyObjectOutput, ManagedUpload} from 'aws-sdk/clients/s3';
import {S3MoveFileError, S3MoveFileErrorCode} from './errors/s3-move-file.error';

@Injectable()
export class S3Client {
    constructor (
        private readonly awsConnection: aws.S3,
        private readonly bucketName: string,
        private readonly filePathPrefix: string,
    ) {}

    public upload (
        filePath: string,
        payload: Body,
        options: ManagedUpload.ManagedUploadOptions = {},
    ): Promise<ManagedUpload.SendData> {
        return new Promise<ManagedUpload.SendData>((resolve: (data: any) => void, reject: (err: any) => void): void => {
            this.awsConnection.upload(
                {
                    Bucket: this.bucketName,
                    Key: this.generateObjectName(filePath),
                    Body: payload,
                },
                options,
                (err: Error, data: ManagedUpload.SendData) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    public uploadInBatch (
        filePath: string,
        payloadItems: object[],
        options: ManagedUpload.ManagedUploadOptions = {},
    ): Promise<ManagedUpload.SendData> {
        if (!Array.isArray(payloadItems) || payloadItems.length === 0) {
            throw new Error('You are trying to upload an empty file.');
        }
        const payload: string = payloadItems
            .reduce((prev: string, value: object): string => `${prev}${JSON.stringify(value)}\n`, '')
            .trim();

        return this.upload(filePath, payload, options);
    }

    public fileExists (filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve: (data: boolean) => void, reject: (err: any) => void): void => {
            this.awsConnection.headObject({
                Bucket: this.bucketName,
                Key: this.generateObjectName(filePath),
            }, (err: aws.AWSError, data: aws.S3.HeadObjectOutput): void => {
                if (!err) {
                    return resolve(!!data);
                } else if (err.statusCode === 404) {
                    return resolve(false);
                }
                reject(err);
            });
        });
    }

    public moveWithinBucket (sourceFilePath: string, targetFilePath: string): Promise<CopyObjectOutput> {
        const sourceObjectName: string = this.generateObjectName(sourceFilePath);

        return new Promise((resolve: (data: any) => void, reject: (err: any) => void): void => {
            this.awsConnection.copyObject({
                Key: this.generateObjectName(targetFilePath),
                CopySource: `${this.bucketName}/${sourceObjectName}`,
                Bucket: this.bucketName,

            }, (copyErr: aws.AWSError, output: CopyObjectOutput): void => {
                if (copyErr) {
                    return reject(new S3MoveFileError(S3MoveFileErrorCode.CopyFailed, copyErr));
                }
                this.awsConnection.deleteObject(
                    {
                        Key: sourceObjectName,
                        Bucket: this.bucketName,
                    },
                    (deleteErr: aws.AWSError) => (deleteErr ?
                        reject(new S3MoveFileError(S3MoveFileErrorCode.DeleteFailed, deleteErr)) :
                        resolve(output)),
                );
            });
        });
    }

    public getEphemeralSignedFileUrl (filePath: string, expiresInSeconds: number = 60): string {
        return this.awsConnection.getSignedUrl(
            'getObject',
            {
                Key: this.generateObjectName(filePath),
                Bucket: this.bucketName,
                Expires: expiresInSeconds,
            },
        );
    }

    private generateObjectName (filePath: string): string {
        return `${this.filePathPrefix ? `${this.filePathPrefix}/` : ''}${filePath}`;
    }
}
