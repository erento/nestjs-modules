import {BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform} from "@nestjs/common";
import {PubsubMessage, PushMessage} from "./domain";
import {PubsubService} from "./pubsub.service";

@Injectable()
export class ParsePubsubMessagePipe<T> implements PipeTransform<PushMessage<T>, Promise<PubsubMessage<T>>> {
    constructor (private readonly pubsubService: PubsubService) {}

    public async transform (pushMessage: PushMessage<T>): Promise<PubsubMessage<T>> {
        try {
            const verification: boolean = await this.pubsubService.verifyMessage(<any> pushMessage.message);
            if (!verification) {
                throw new HttpException('Not able to parse the message, acking with 2xx status code.', HttpStatus.OK);
            }
            const decryptedMessage: string = await this.pubsubService.decryptMessage(<any> pushMessage.message);

            return JSON.parse(decryptedMessage);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }
            throw new BadRequestException(`Unable to decode pubsub message. Original message: ${e && e.message}`);
        }
    }
}
