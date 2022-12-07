import {Server} from 'http';
import {OnApplicationBootstrap, OnApplicationShutdown, ShutdownSignal} from '@nestjs/common';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {GRACE_PERIOD, SHUTDOWN_TIMEOUT_PERIOD} from '../constants';
import {Environments} from '../environments/environments';
import {EnvironmentType} from '../environments/interfaces';
import {Logger} from '../logger/logger';

export abstract class BaseAppService implements OnApplicationBootstrap, OnApplicationShutdown {
    protected server: Server | undefined;
    protected started: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    protected terminating: Subject<boolean> = new Subject<boolean>();

    protected constructor (protected readonly logger: Logger) {}

    public setServer (server: Server): void {
        this.server = server;
        this.logger.log(`The server was successfully set to shutdown handler.`);
    }

    public onApplicationBootstrap (): void {
        this.started.next(true);
        this.logger.log(`Application bootstrapped successfully.`);
    }

    public onApplicationShutdown (signal: string): Promise<void> {
        this.logger.log(`Application shutdown: The "${signal}" event was fired.`);
        this.terminating.next(true);

        if (ShutdownSignal.SIGINT === signal && Environments.getEnv() === EnvironmentType.DEV) {
            return Promise.resolve();
        }

        if (this.server) {
            this.server.close((): void => {
                this.logger.log(`Application shutdown: The server was closed.`);
            });
        }

        return new Promise((res: any): void => {
            let i: number = 0;
            const interval: NodeJS.Timeout = setInterval(async (): Promise<void> => {
                this.logger.log(`Application shutdown: Waiting #${++i}`);

                if (i >= GRACE_PERIOD / SHUTDOWN_TIMEOUT_PERIOD) {
                    await this.closeDatabaseConnection();
                    this.logger.log(`Application shutdown: It should be already safe to exit, resolving!`);
                    clearInterval(interval);
                    res();
                }
            }, SHUTDOWN_TIMEOUT_PERIOD);
        });
    }

    public hasStarted (): Observable<boolean> {
        return this.started.asObservable();
    }

    public isTerminating (): Observable<boolean> {
        return this.terminating.asObservable();
    }

    protected closeDatabaseConnection (): Promise<void> {
        // overwrite this method to close your DB connections
        // in constructor: @InjectConnection() private readonly databaseConnection: Sequelize,
        // here: await this.databaseConnection.close();

        return Promise.resolve();
    }
}
