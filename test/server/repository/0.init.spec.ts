import { assert } from 'chai';
import 'mocha';
import { TestDatabase } from './___db';

const database_name: string = "ci_test_db";

describe('Init the db', () => {
    let testDB: TestDatabase;

    before(async () => {
        testDB = new TestDatabase();
        await testDB.createConnection();
        let queryRunner = testDB.connection.createQueryRunner();
        let exist: boolean = await queryRunner.hasDatabase(database_name);
        if (exist) {
            await queryRunner.dropDatabase(database_name);
        }
        await queryRunner.createDatabase(database_name);
        queryRunner.release();
        await testDB.closeConnection();
        await testDB.createConnection();
    });

    it('inits the database', async () => {
        await testDB.initDatabase();
    });

    after(async () => {
        await testDB.closeConnection();
    });



});