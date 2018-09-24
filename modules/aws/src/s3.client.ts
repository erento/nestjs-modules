import {Injectable} from '@nestjs/common';
import * as aws from 'aws-sdk';
import {ManagedUpload} from 'aws-sdk/clients/s3';

@Injectable()
export class S3Client {
    private connection: aws.S3;

    constructor (private regionName: string, private bucketName: string, private filePathPrefix: string) {
        this.connection = new aws.S3({region: this.regionName});
    }

    public upload (filePath: string, payload: string): Promise<ManagedUpload.SendData> {
        return new Promise<ManagedUpload.SendData>((resolve: Function, reject: Function): void => {
            this.connection.upload(
                {
                    Bucket: this.bucketName,
                    Key: `${this.filePathPrefix}/${filePath}`,
                    Body: payload,
                },
                (err: Error, data: ManagedUpload.SendData) => {
                    err ? reject(err) : resolve(data);
                },
            );
        });
    }

    public uploadInBatch (filePath: string, payloadItems: object[]): Promise<ManagedUpload.SendData> {
        if (!Array.isArray(payloadItems) || payloadItems.length < 1) {
            throw new Error('You are trying to upload an empty file.');
        }
        const payload: string = payloadItems
            .reduce((prev: string, value: object): string => `${prev}${JSON.stringify(value)}\n`, '')
            .trim();

        return new Promise<ManagedUpload.SendData>((resolve: Function, reject: Function): void => {
            this.connection.upload(
                {
                    Bucket: this.bucketName,
                    Key: `${this.filePathPrefix}/${filePath}`,
                    Body: payload,
                },
                (err: Error, data: ManagedUpload.SendData) => {
                    err ? reject(err) : resolve(data);
                },
            );
        });
    }
}
