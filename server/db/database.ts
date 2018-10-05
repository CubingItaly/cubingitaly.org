import { createConnection, Connection, getCustomRepository, BaseEntity } from "typeorm";
import { _BOOTSTRAPS } from "./__bootstraps";
import { BaseCommonRepository } from "./BaseCommonRepository";

export class Database {

    connection: Connection;
    private isConnected: boolean = false;

    public async createConnection(): Promise<void> {
        this.connection = await createConnection();
        this.isConnected = true;
    }

    public async closeConnection() {
        this.connection.close();
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