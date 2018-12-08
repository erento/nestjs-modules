import {Injectable} from '@nestjs/common';
import {Sequelize} from 'sequelize-typescript';
import {BasicDatabaseProvider} from './basic-database.provider';

@Injectable()
export class DatabaseProvider extends BasicDatabaseProvider {
    constructor (sequelize: Sequelize) {
        super (sequelize);
    }
}
