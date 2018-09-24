import {DynamicModule, Module, Provider} from '@nestjs/common';
import {Model} from 'sequelize-typescript';
import {DatabaseProvider} from './database.provider';

export interface DatabaseCredentials {
    host: string;
    name: string;
    password: string;
    user: string;
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

    public static forRoot (models: typeof Model[], credentials: DatabaseCredentials): DynamicModule {
        const providers: Provider[] = [{
            provide: DatabaseProvider,
            useFactory: async (): Promise<DatabaseProvider> => {
                DatabaseModule.databaseProvider = DatabaseProvider.create(models, credentials);

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
