import {Injectable, NestMiddleware} from '@nestjs/common';
import {Logger} from '../logger/logger';

/**
 * List of URLs which will be skipped for logging.
 */
const filteredUrls: string[] = [
    '/favicon.ico',
];

interface ExtendedRequest extends Request {
    originalUrl: string;
}

@Injectable()
export class ElapsedTimeMiddleware implements NestMiddleware {
    constructor (private readonly logger: Logger) {}

    public async use (req: ExtendedRequest, res: any, next: any): Promise<void> {
        if (filteredUrls.indexOf(req.url) !== -1) {
            next();
            return;
        }

        const startHrTime: [number, number] = process.hrtime();
        const requestIdentifier: string = `${req.method} ${req.originalUrl}`;
        res.on('finish', (): void => {
            const elapsedHrTime: [number, number] = process.hrtime(startHrTime);
            const elapsedTimeInMs: number = elapsedHrTime[0] * 1e3 + elapsedHrTime[1] / 1e6;
            this.logger.logObject({
                statusCode: `${res.statusCode}`,
                request: requestIdentifier,
                elapsedTime: `${elapsedTimeInMs}`,
                message: `Route finished: ${requestIdentifier} ${res.statusCode}, execution time ${elapsedTimeInMs}ms`,
            });
        });

        this.logger.log(`Route started: ${requestIdentifier}`);
        next();
    }
}
