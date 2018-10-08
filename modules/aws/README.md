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

## Stay in touch

* [Erento's developers](mailto:developers@erento.com) 

## License

This module is [MIT licensed](LICENSE.md).
