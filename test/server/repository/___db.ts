import { Connection, createConnection, BaseEntity } from "typeorm";
import { BaseCommonRepository } from "../../../server/db/BaseCommonRepository";
import { _BOOTSTRAPS } from "../../../server/db/__bootstraps";

export class TestDatabase {

    connection: Connection;
    private isConnected: boolean = false;

    public async createConnection(): Promise<void> {
        this.connection = await createConnection({
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "matteo",
            "password": "",
            "database": "ci_test_db",
            "synchronize": true,
            "logging": false,
            "entities": [
                "server/db/entity/**/*.ts",
                "server/db/entity/**/*.js"
            ],
        });
        this.isConnected = true;
    }

    public async closeConnection() {
        await this.connection.close();
        this.isConnected = false;
    }

    public async initDatabase(): Promise<void> {
        let repos: BaseCommonRepository<BaseEntity>[] = _BOOTSTRAPS();
        for (const repo of repos) {
            await repo.InitDefaults();
        }

        return;
    }

}