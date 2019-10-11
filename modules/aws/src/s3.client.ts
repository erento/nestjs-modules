import {Injectable} from '@nestjs/common';
import * as aws from 'aws-sdk';
import {Body, ManagedUpload} from 'aws-sdk/clients/s3';

@Injectable()
export class S3Client {
    constructor (private connection: aws.S3, private bucketName: string, private filePathPrefix: string) {}

    public upload (
        filePath: string,
        payload: Body,
        options: ManagedUpload.ManagedUploadOptions = {},
    ): Promise<ManagedUpload.SendData> {
        return new Promise<ManagedUpload.SendData>((resolve: Function, reject: Function): void => {
            this.connection.upload(
                {
                    Bucket: this.bucketName,
                    Key: `${this.filePathPrefix ? this.filePathPrefix + '/' : ''}${filePath}`,
                    Body: payload,
                },
                options,
                (err: Error, data: ManagedUpload.SendData) => {
                    err ? reject(err) : resolve(data);
                },
            );
        });
    }

    public uploadInBatch (
        filePath: string,
        payloadItems: object[],
        options: ManagedUpload.ManagedUploadOptions = {},
    ): Promise<ManagedUpload.SendData> {
        if (!Array.isArray(payloadItems) || payloadItems.length < 1) {
            throw new Error('You are trying to upload an empty file.');
        }
        const payload: string = payloadItems
            .reduce((prev: string, value: object): string => `${prev}${JSON.stringify(value)}\n`, '')
            .trim();

        return this.upload(filePath, payload, options);
    }
}
