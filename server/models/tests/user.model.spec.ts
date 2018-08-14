import { UserModel } from '../classes/user.model';
import { assert } from 'chai';
import 'mocha';

let user: UserModel;

describe('Test function to check if user is delegate', function () {

    let tests = [
        { status: null, expected: false },
        { status: "Delegate", expected: true },
        { status: "Candidate Delegate", expected: true }
    ]

    tests.forEach((test) => {
        before(() => {
            user = new UserModel();
            user.id = 0;
            user.name = "Test Name";
            user.wca_id = "2010NAME01";
        });
        it('Checks if user is delegate', () => {
            user.delegate_satus = test.status;

            assert.equal(user.isDelegate(), test.expected);
        });
    });

});

describe('Test permissions',()=>{

});

describe('Test memberships', ()=>{
    
});