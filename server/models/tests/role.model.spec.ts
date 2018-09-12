import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../classes/role.model';

let role: RoleModel;

describe('Test RoleModel equals function', () => {

    before(() => {
        role = new RoleModel();
        role.isLeader = true;
        role.team = "team";
        role.user = 0;
    });

    it('Compares two equals roles', () => {
        let crole: RoleModel = new RoleModel();
        crole.isLeader = true;
        crole.team = "team";
        crole.user = 0;

        assert.equal(crole.equals(role), true);
    });


    it('Compares two different roles', () => {
        let crole: RoleModel = new RoleModel();
        crole.isLeader = true;
        crole.team = "tem";
        crole.user = 0;

        assert.equal(crole.equals(role), false);
    });

});