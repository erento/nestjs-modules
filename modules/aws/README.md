# NestJS AWS module

## Currently supports:
 - S3 upload

## How to use it
1. Import this module in the module you want to use it as:

    ```ts
    imports: [
        AwsModule.forRoot(
            'eu-west-1',
            'my-bucket-name',
            'my/folder-structure',
            './config/aws.credentials.json',
        ),
    ]
    ```

2. Upload a file:

    Import the `S3Client` service via dependency injection to your service and use it as follows:

    - Body as a text:
        ```ts
        await this.S3Client.upload('folder/file-name.jpg', 'some text');
        ```

    - Body as a `@UploadedFile` from `FileInterceptor`:
        ```ts
        await this.S3Client.upload('folder/file-name.jpg', uploadedFile.buffer);
        ```

    You can also provide S3 upload options to any request via 3rd argument.

## Stay in touch

* [Erento's developers](mailto:developers@erento.com) 

## License

This module is [MIT licensed](LICENSE.md).
