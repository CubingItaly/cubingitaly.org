import 'mocha';
import * as sinon from 'sinon';
import { app } from './fakeserver';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as typeorm from 'typeorm';
import { Deserialize } from 'cerialize';
import * as loginUtils from '../../../shared/login.utils';
import { UserRepository } from '../../../db/repository/user.repository';
import { FakeUserRepo } from './fake.user.repo';
import { FakeTeamRepo } from './fake.team.repo';
import { TeamRepository } from '../../../db/repository/team.repository';
import { FakeRoleRepo } from './fake.role.repo';
import { RoleRepository } from '../../../db/repository/role.repository';

chai.use(chaiHttp);

let mockUserRepo;
let mockTeamRepo;
let mockRoleRepo;

describe('Test the team APIs', () => {

    before(() => {
        let fakeUserRepo: FakeUserRepo = new FakeUserRepo();
        mockUserRepo = sinon.stub(typeorm, 'getCustomRepository').withArgs(UserRepository).returns(fakeUserRepo);
        let fakeTeamRepo: FakeTeamRepo = new FakeTeamRepo();
        mockTeamRepo = sinon.stub(typeorm, 'getCustomRepository').withArgs(TeamRepository).returns(fakeTeamRepo);
        let fakeRoleRepo: FakeRoleRepo = new FakeRoleRepo();
        mockRoleRepo = sinon.stub(typeorm, 'getCustomRepository').withArgs(RoleRepository).returns(fakeRoleRepo);
    });

    





    after(() => {
        mockUserRepo.restore();
        mockTeamRepo.restore();
        mockRoleRepo.restore();
    });
});