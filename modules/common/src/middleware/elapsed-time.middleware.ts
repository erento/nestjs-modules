import {Injectable, NestMiddleware} from '@nestjs/common';
import {Logger} from '../logger/logger';

/**
 * List of URLs which will be skipped for logging.
 */
const filteredUrls: Set<string> = new Set([
    '/favicon.ico',
]);

interface ExtendedRequest extends Request {
    originalUrl: string;
}

@Injectable()
export class ElapsedTimeMiddleware implements NestMiddleware {
    constructor (private readonly logger: Logger) {}

    public use (req: ExtendedRequest, res: any, next: () => void): void {
        if (filteredUrls.has(req.url)) {
            next();

            return;
        }

        const startHrTime: [number, number] = process.hrtime();
        res.on('finish', (): void => {
            const elapsedHrTime: [number, number] = process.hrtime(startHrTime);
            const elapsedTimeInMs: number = (elapsedHrTime[0] * 1e3) + (elapsedHrTime[1] / 1e6);
            this.logger.log({
                statusCode: `${res.statusCode}`,
                elapsedTime: `${elapsedTimeInMs}`,
                message: 'Route finished',
            });
        });

        this.logger.log('Route started');
        next();
    }
}
