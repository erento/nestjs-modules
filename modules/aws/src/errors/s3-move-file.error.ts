import * as aws from 'aws-sdk';

export enum S3MoveFileErrorCode {
    CopyFailed = 100,
    DeleteFailed = 200,
}

export class S3MoveFileError extends Error {
    constructor (public code: S3MoveFileErrorCode, public originalError?: aws.AWSError) {
        super(`Copy failed with code ${code}`);

        Object.setPrototypeOf(this, S3MoveFileError.prototype);
    }
}
