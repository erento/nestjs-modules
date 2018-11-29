import {Model, Sequelize} from 'sequelize-typescript';
import {DatabaseCredentials} from './database.module';
import {SyncOptions} from 'sequelize';

export interface ProviderOptions {
    operatorsAliases?: boolean;

    /**
     * if not provided, sync is not called.
     */
    syncOptions?: SyncOptions;
}

/**
 * Basic Database Provider which can only be extended due to protected constructor
 */
export class BasicDatabaseProvider {
    public static async create (
        models: typeof Model[] = [],
        credentials: DatabaseCredentials,
        options?: ProviderOptions,
    ): Promise<BasicDatabaseProvider> {
        if (!credentials) {
            throw new Error('Database provider needs the credentials to be instantiated.');
        }

        if (!BasicDatabaseProvider.instance) {
            const sequelize: Sequelize = new Sequelize({
                database: credentials.name,
                dialect: credentials.dialect,
                password: credentials.password,
                host: credentials.host,
                port: credentials.port,
                username: credentials.user,
                operatorsAliases: options && options.operatorsAliases ? options.operatorsAliases : false,
            });

            sequelize.addModels(models);
            if (options && options.syncOptions) {
                await sequelize.sync(options.syncOptions);
            }

            BasicDatabaseProvider.instance = sequelize;
        }

        return new this(BasicDatabaseProvider.instance);
    }

    private static instance: Sequelize;

    protected constructor (protected readonly sequelize: Sequelize) {}

    public getConnection (): Sequelize {
        return this.sequelize;
    }
}
