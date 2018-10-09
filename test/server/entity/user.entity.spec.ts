import 'mocha';
import { assert } from 'chai';
import { UserEntity } from '../../../server/db/entity/user.entity';
import { TeamEntity } from '../../../server/db/entity/team.entity';
import { RoleEntity } from '../../../server/db/entity/role.entity';
import { RoleModel } from '../../../server/models/classes/role.model';
import { UserModel } from '../../../server/models/classes/user.model';


describe('Test the user entity assimilate method', () => {

    let user: UserModel;

    before(() => {
        user = new UserModel();
        user.name = "User";
        user.id = 397;
    });

    it('Test when the user has no WCA id and is not delegate', () => {
        let entity: UserEntity = new UserEntity();
        entity._assimilate(user);
        assert.equal(entity.id, user.id);
        assert.equal(entity.name, user.name);
        assert.equal(entity.wcaId, null);
        assert.equal(entity.delegateStatus, null);
    });

    it('Test when the user has a WCA id', () => {
        user.wca_id = "2010CUBI01";
        let entity: UserEntity = new UserEntity();
        entity._assimilate(user);
        assert.equal(entity.wcaId, user.wca_id);
    });


    it('Test when the user is candidate delegate', () => {
        user.delegate_status = "Candidate Delegate";
        let entity: UserEntity = new UserEntity();
        entity._assimilate(user);
        assert.equal(entity.delegateStatus, user.delegate_status);
    });

});


describe('Test the user entity transform method', () => {

    let user: UserEntity;

    before(() => {
        user = new UserEntity();
        user.name = "User";
        user.id = 397;
    });

    it('Test when the user has only id and name', () => {
        let model: UserModel = user._transform();
        assert.equal(model.id, user.id);
        assert.equal(model.name, user.name);
        assert.equal(model.delegate_status, null);
        assert.equal(model.wca_id, null);
        assert.equal(model.roles.length, 0);
    });

    it('Test when the user has a WCA id and a delegate status', () => {
        user.wcaId = "2010CUBI01";
        user.delegateStatus = "Delegate";
        let model: UserModel = user._transform();
        assert.equal(model.delegate_status, user.delegateStatus);
        assert.equal(model.wca_id, user.wcaId);

    });


    it('Test when the user has a role', () => {
        let role: RoleEntity = new RoleEntity();
        role.isLeader = true;
        role.team = new TeamEntity();
        role.team.id = "citi";
        role.team.name = "CITI";
        role.team.isPublic = true;
        role.user = new UserEntity();
        role.user.id = user.id;

        user.roles = [role];

        let model: UserModel = user._transform();
        assert.equal(model.roles.length, 1);
        assert.equal(model.roles[0].user, user.id);
        assert.equal(model.roles[0].team, "citi");
        assert.equal(model.roles[0].isLeader, true);
    });

});