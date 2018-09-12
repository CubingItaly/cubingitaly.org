import 'mocha';
import { assert } from 'chai';
import { UserEntity } from '../entity/user.entity';
import { TeamEntity } from '../entity/team.entity';
import { RoleEntity } from '../entity/role.entity';
import { RoleModel } from '../../models/classes/role.model';


describe('It test the transform function of the role', () => {

    let user: UserEntity;
    let team: TeamEntity;

    before(() => {
        user = new UserEntity();
        team = new TeamEntity();

        user.id = 1;
        user.name = "Test Name";

        team.id = "citi";
        team.name = "Test Name";
    });

    it('test the transform function', () => {
        let role: RoleEntity = new RoleEntity();
        role.isLeader = true;
        role.user = user;
        role.team = team;

        let model: RoleModel = role._transform();

        assert.equal(model.user, user.id);
        assert.equal(model.team, team.id);
        assert.equal(model.isLeader, true);
    });

});