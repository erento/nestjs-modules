import {Injectable} from '@nestjs/common';
import {PoolOptions, SyncOptions} from 'sequelize';
import {Model, Sequelize} from 'sequelize-typescript';
import {DatabaseCredentials} from './database.module';

export interface ProviderOptions {
    logging?: boolean | ((sql: string, timing?: number) => void);
    operatorsAliases?: boolean;
    pool?: PoolOptions;

    /**
     * if not provided, sync is not called.
     */
    syncOptions?: SyncOptions;
}

@Injectable()
export class DatabaseProvider {
    private static instance: Sequelize;
    constructor (private readonly sequelize: Sequelize) {}

    public static async create (
        models: typeof Model[] = [],
        credentials: DatabaseCredentials,
        options?: ProviderOptions,
    ): Promise<DatabaseProvider> {
        if (!credentials) {
            throw new Error('Database provider needs the credentials to be instantiated.');
        }

        if (!DatabaseProvider.instance) {
            const sequelize: Sequelize = new Sequelize({
                database: credentials.name,
                dialect: credentials.dialect,
                password: credentials.password,
                host: credentials.host,
                port: credentials.port,
                username: credentials.user,
                operatorsAliases: options ? (options.operatorsAliases === false ? {} : undefined) : undefined,
                logging: options && options.logging && {}.toString.call(options.logging) === '[object Function]' ?
                    options.logging :
                    undefined,
                pool: options && options.pool ?
                    options.pool :
                    undefined,
            });

            sequelize.addModels(models);
            if (options && options.syncOptions) {
                await sequelize.sync(options.syncOptions);
            }

            DatabaseProvider.instance = sequelize;
        }

        return new DatabaseProvider(DatabaseProvider.instance);
    }

    public getConnection (): Sequelize {
        return this.sequelize;
    }
}
