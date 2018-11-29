import {DynamicModule, Module, Provider} from '@nestjs/common';
import {Model} from 'sequelize-typescript';
import {DatabaseProvider} from './database.provider';
import {ProviderOptions} from './basic-database.provider';

export interface DatabaseCredentials {
    host: string;
    name: string;
    password: string;
    user: string;
    dialect: 'postgres' | 'mysql';
    port: number;
}

@Module({})
export class DatabaseModule {
    public static databaseProvider: any;

    public static forChild (): DynamicModule {
        const providers: Provider[] = [{
            provide: DatabaseProvider,
            useValue: DatabaseModule.databaseProvider,
        }];

        return {
            module: DatabaseModule,
            providers,
            exports: providers,
        };
    }

    public static forRoot (models: typeof Model[], credentials: DatabaseCredentials, options?: ProviderOptions): DynamicModule {
        const providers: Provider[] = [{
            provide: DatabaseProvider,
            useFactory: async (): Promise<DatabaseProvider> => {
                DatabaseModule.databaseProvider = DatabaseProvider.create(models, credentials, options);
                return DatabaseModule.databaseProvider;
            },
        }];

        return {
            module: DatabaseModule,
            providers,
            exports: providers,
        };
    }
}
