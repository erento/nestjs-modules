# NestJS modules

## List of modules and its current responsibilities
 - [AWS](modules/aws)
    - S3 upload
 - [Salesforce](modules/salesforce)
    - Process outbound messages
 - [Google Pub/Sub module](modules/google-pubsub)
    - Send, receive and verify Google Pub/Sub messages (messages are by default encrypted)
    
Each module is self published under `@erento` scope.

## Development
To avoid publishing unfinished and untested package please follow this approach:

- Go to specific module you want to work with
- Run `npm run build`
- Run `npm pack`
- Go to you project where you want to use this module and install it in the following way:
  `npm i ../PATH_TO_THE_MODULE/MODULE_NAME-X.X.X.tgz`


## Publishing
- Make sure you:
  - you tested a changes
  - raised a version accordingly to the [SEMVER](https://semver.org) specification in `package.json` and run `npm i` to change it in the lock file as well
  - updated main [README.md](README.md), if needed
- Always run `npm run build` before.
- As a last step, run: `npm publish`
