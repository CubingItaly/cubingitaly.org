import { assert } from 'chai';
import 'mocha';
import { RoleModel } from '../../../server/models/classes/role.model';

let role: RoleModel;

function generateRole(isleader: boolean, team: string, user: number) {
    let role: RoleModel = new RoleModel();
    role.isLeader = isleader;
    role.team = team;
    role.user = user;
    return role;
}


describe('Test equals', () => {

    it('Test when it is equal', () => {
        let first: RoleModel = generateRole(true, "citi", 1);
        let second: RoleModel = generateRole(true, "citi", 1);

        assert.equal(first.equals(second), true);
    });

    it('Test when isLeader is different', () => {
        let first: RoleModel = generateRole(false, "citi", 1);
        let second: RoleModel = generateRole(true, "citi", 1);

        assert.equal(first.equals(second), false);
    });

    it('Test when team is different', () => {
        let first: RoleModel = generateRole(true, "citq", 1);
        let second: RoleModel = generateRole(true, "citi", 1);

        assert.equal(first.equals(second), false);
    });

    it('Test when user is different', () => {
        let first: RoleModel = generateRole(true, "citi", 2);
        let second: RoleModel = generateRole(true, "citi", 1);

        assert.equal(first.equals(second), false);
    });

    it('Test when it is completely different', () => {
        let first: RoleModel = generateRole(true, "citi", 1);
        let second: RoleModel = generateRole(false, "citq", 2);

        assert.equal(first.equals(second), false);
    });

});