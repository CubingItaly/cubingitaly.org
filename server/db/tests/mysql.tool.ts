import * as mysql from 'mysql';
import mysqldump from 'mysqldump';
import * as mysqlimport from './mysql.import';
import { keys } from '../../secrets/keys';


class MysqlDatabase {
    private connection;
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}


export class MysqlTool {


    private db: MysqlDatabase;
    constructor() {
        this.db = new MysqlDatabase({
            host: keys.db.host,
            user: keys.db.user,
            password: keys.db.password,
        });
    }

    private async backupDatabase(): Promise<void> {
        await mysqldump({
            connection: {
                host: keys.db.host,
                user: keys.db.user,
                password: keys.db.password,
                database: keys.db.database
            },
            dumpToFile: './server/db/tests/dump.sql',
        })
    }

    private async cleanDatabase(): Promise<void> {
        await this.db.query("DROP DATABASE " + keys.db.database, null);
        await this.db.query("CREATE DATABASE " + keys.db.database, null);
    }

    private async restoreDatabase(): Promise<void> {
        let importer = mysqlimport.config({
            host: keys.db.host,
            user: keys.db.user,
            password: keys.db.password,
            database: keys.db.database,
            onerror: err => console.log(err.message)
        });
        await importer.import('./server/db/tests/dump.sql');
        await importer.closeConnection();
        return;
    }

    private async closeDatabase() {
        await this.db.close();
    }


    public async prepareDatabaseToTest() {
        try {
            await this.backupDatabase();
            await this.cleanDatabase();
        } catch (e) {
            /* istanbul ignore next */
            console.log("the database was void");
        }
    }

    public async restoreDatabaseAfterTest() {
        await this.cleanDatabase();
        await this.restoreDatabase();
        await this.closeDatabase();
    }
}