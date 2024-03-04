import {Module} from '@nestjs/common';
import {DynamicModule, Provider} from '@nestjs/common/interfaces/modules';
import * as aws from 'aws-sdk';
import {S3Client} from './s3.client';

@Module({})
export class AwsModule {
    // eslint-disable-next-line @stylistic/lines-around-comment
    /**
     * The config's file path can be passed as path to JSON config, otherwise the aws library take it from the home folder
     * fyi: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
     *
     * @param regionName
     * @param bucketName
     * @param filePathPrefix
     * @param configFilePath
     *
     * @returns
     */
    public static forRoot (
        regionName: string,
        bucketName: string,
        filePathPrefix: string,
        configFilePath?: string,
    ): DynamicModule {
        if (configFilePath) {
            aws.config.loadFromPath(configFilePath);
        }

        const providers: Provider[] = [
            {provide: S3Client, useValue: new S3Client(new aws.S3({region: regionName}), bucketName, filePathPrefix)},
        ];

        return {
            module: AwsModule,
            providers,
            exports: providers,
        };
    }
}
