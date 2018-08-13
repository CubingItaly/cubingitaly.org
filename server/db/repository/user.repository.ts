import { EntityRepository, Like } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { TeamEntity } from "../entity/team.entity";



@EntityRepository(UserEntity)
export class UserRepository extends BaseCommonRepository<UserEntity>{

    public _entityIdentifier = "UserEntity";


    public async InitDefaults(): Promise<void> {
        return;
    }

    /**
     * Checks if the given user exists and, if so, returns true
     * 
     * @param user 
     */
    public async checkIfUserExists(user: UserEntity): Promise<boolean> {
        return await this.checkIfUserExistsById(user.id);
    }

    /**
     * Checks if the given user exists and, if so, returns true
     * 
     * @param id 
     */
    public async checkIfUserExistsById(id: number): Promise<boolean> {
        let result: UserEntity = await this.repository.findOne(id);
        return (result !== undefined && result !== null);
    }

    /**
     * Search for a user and returns it
     * If the user is not found returns null
     * 
     * @param id  
     */
    public async getUserById(id: number): Promise<UserEntity> {
        let exist: boolean = await this.checkIfUserExistsById(id);
        if (exist) {
            return await this.repository.findOne(id, { relations: ["roles", "roles.team", "roles.user"] });
        }
        return;
    }

    /**
     * Search for a user and returns it with only his personal data
     * If the user is not found returns null
     * 
     * @param id  
     */
    public async getShortUserById(id: number): Promise<UserEntity> {
        let exist: boolean = await this.checkIfUserExistsById(id);
        if (exist) {
            return await this.repository.findOne(id);
        }
        return;
    }

    /**
     * Updates the user in the database and returns it
     * 
     * @param user 
     */
    public async updateUser(user: UserEntity): Promise<UserEntity> {
        await this.repository.save(user);
        return await this.getUserById(user.id);
    }


    /**
     * Find the first 10 users whose name starts with the parameter
     * 
     * @param name 
     */
    public async findUsersByName(name: string): Promise<UserEntity[]> {
        let result: UserEntity[] = await this.repository.find({
            select: ["id", "wcaId", "name", "delegateStatus"],
            where: { name: Like(name + "%") },
            take: 10,
            order: { name: "ASC" }
        })
        return result;
    }

    /**
     * Find users that have a role in the team received as a parameter
     * @param team 
     */
    public async findUsersByTeam(team: TeamEntity): Promise<UserEntity[]> {
        let result: UserEntity[] = await this.repository.createQueryBuilder("user")
            .innerJoin("user.roles", "roles")
            .where("roles.team = :tid", { tid: team.id })
            .getMany();
        return result;
    }

}