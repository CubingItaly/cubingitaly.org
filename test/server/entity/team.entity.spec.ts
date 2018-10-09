import 'mocha';
import { assert } from 'chai';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { TeamEntity } from '../../../server/db/entity/team.entity';
import { RoleEntity } from '../../../server/db/entity/role.entity';
import { RoleModel } from '../../../server/models/classes/role.model';
import { TeamModel } from '../../../server/models/classes/team.model';


describe('It test the transform function of the team', () => {

    let team: TeamEntity;

    before(() => {
        team = new TeamEntity();
        team.id = "citi";
        team.name = "CITI";
        team.isPublic = true;
    });

    it('test the transform of a team without members', () => {
        let model: TeamModel = team._transform();
        assert.equal(model.id, team.id);
        assert.equal(model.name, team.name);
        assert.equal(model.isPublic, team.isPublic);
        assert.equal(model.roles.length, 0);
    });

    it('test the transform of a team with a member', () => {
        let role: RoleEntity = new RoleEntity();
        role.isLeader = true;
        role.team = team
        role.user = new UserEntity();
        role.user.id = 397;

        team.roles = [role];

        let model: TeamModel = team._transform();
        assert.equal(model.roles.length, 1);
        assert.equal(model.roles[0].user, role.user.id);
        assert.equal(model.roles[0].team, team.id);
        assert.equal(model.roles[0].isLeader, role.isLeader);

    });
});

describe('It test the assimilate function of the team', () => {

    let team: TeamModel;

    before(() => {
        team = new TeamModel();
        team.id = "citi";
        team.name = "Name";
    });

    it('test when is public is missing', () => {
        let entity: TeamEntity = new TeamEntity();
        entity._assimilate(team);
        assert.equal(team.id, entity.id);
        assert.equal(team.name, entity.name);
        assert.equal(entity.isPublic, true);
    });

    it('test when is public is false', () => {
        team.isPublic = false;
        let entity: TeamEntity = new TeamEntity();
        entity._assimilate(team);
        assert.equal(entity.isPublic, false);
    });

});