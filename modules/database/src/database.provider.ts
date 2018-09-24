import {Injectable} from '@nestjs/common';
import {Model, Sequelize} from 'sequelize-typescript';
import {DatabaseCredentials} from './database.module';

@Injectable()
export class DatabaseProvider {
    public static async create (models: typeof Model[] = [], credentials: DatabaseCredentials): Promise<DatabaseProvider> {
        if (!credentials) {
            throw new Error('Database provider needs the credentials to be instantiated.');
        }

        if (!DatabaseProvider.instance) {
            const sequelize: Sequelize = new Sequelize({
                username: credentials.user,
                password: credentials.password,
                database: credentials.name,
                host: credentials.host,
                port: 5432,
                dialect: 'postgres',
                operatorsAliases: false,
            });

            sequelize.addModels(models);
            await sequelize.sync({
                alter: true,
            });

            DatabaseProvider.instance = sequelize;
        }

        return new DatabaseProvider(DatabaseProvider.instance);
    }

    private static instance: Sequelize;

    constructor (private readonly sequelize: Sequelize) {}

    public getConnection (): Sequelize {
        return this.sequelize;
    }
}
