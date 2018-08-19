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
        let repo: BaseCommonRepository<BaseEntity>[] = _BOOTSTRAPS();
        for(let i = 0; i< repo.length; i++){
            await repo[i].InitDefaults();
        }
        return;
    }

}