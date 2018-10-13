import { EntityRepository, Like, getCustomRepository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { TeamEntity } from "../entity/team.entity";
import { TeamRepository } from "./team.repository";
import { RoleRepository } from "./role.repository";
import { keys } from "../../secrets/keys";



@EntityRepository(UserEntity)
export class UserRepository extends BaseCommonRepository<UserEntity>{

    public _entityIdentifier = "UserEntity";


    public async InitDefaults(): Promise<void> {
        let exist: boolean = await this.checkIfUserExists(0);
        if (!exist) {
            let user: UserEntity = new UserEntity();
            user.id = 0;
            user.name = "Cubing Italy";
            await this.repository.save(user);
        }
        return;
    }

    /**
     * Checks if the given user exists and, if so, returns true
     * 
     * @param id 
     */
    public async checkIfUserExists(id: number): Promise<boolean> {
        let count: number= await this.repository.count({where: {id:id}});
        return count > 0;
    }

    /**
     * Search for a user and returns it
     * If the user is not found returns undefined
     * 
     * @param id  
     */
    public async getUserById(id: number): Promise<UserEntity> {
        let user: UserEntity = await this.repository.findOne(id, { relations: ["roles", "roles.team", "roles.user"] });
        if (user && user.roles.length === 1 && user.roles[0].isLeader === null
            && user.roles[0].team === null && user.roles[0].user === null) {
            user.roles = [];
        }
        return user;
    }

    /**
     * Search for a user and returns it with only his personal data
     * If the user is not found returns undefined
     * 
     * @param id  
     */
    public async getShortUserById(id: number): Promise<UserEntity> {
        return this.repository.findOne(id);
    }

    /**
     * Updates the user in the database and returns it
     * 
     * @param user 
     */
    public async updateUser(user: UserEntity): Promise<UserEntity> {
        await this.repository.save(user);
        let adminId = Number(keys.admin.id);
        if (adminId && user.id === adminId) {
            user = await this.getUserById(user.id);
            let team: TeamEntity = await getCustomRepository(TeamRepository).getTeamById(keys.admin.shortname);
            let roleRepo: RoleRepository = getCustomRepository(RoleRepository);
            await roleRepo.addRole(user, team);
        }
        return this.getUserById(user.id);
    }


    /**
     * Find the first 10 users whose name starts with the parameter
     * 
     * @param name 
     */
    public async findUsersByName(name: string): Promise<UserEntity[]> {
        return this.repository.find({
            select: ["id", "wcaId", "name", "delegateStatus"],
            where: { name: Like(name + "%") },
            take: 10,
            order: { name: "ASC" }
        })

    }

    /**
     * Find users that have a role in the team received as a parameter
     * @param team 
     */
    public async findUsersByTeam(team: TeamEntity): Promise<UserEntity[]> {
        return this.repository.createQueryBuilder("user")
            .innerJoinAndSelect("user.roles", "roles")
            .innerJoinAndSelect("roles.team", "team")
            .innerJoinAndSelect("roles.user", "secondUser")
            .where("team.id = :tid", { tid: team.id })
            .orderBy("user.name", "ASC")
            .getMany();
    }

}