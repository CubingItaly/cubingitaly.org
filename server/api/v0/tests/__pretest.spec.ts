import * as sinon from 'sinon';
import * as loginUtils from '../../../shared/login.utils';
import * as errorUtils from '../../../shared/error.utils';

/* These need to be here because verifyLogin must be stubbed before the server is initialied */
let verifyLogin = function (req, res, next): void {
    if (loginUtils.isLoggedIn(req)) {
        next();
    } else {
        errorUtils.sendError(res, 403, "Login is required. Please, login and retry.")
    }
}

let verifyStub = sinon.stub(loginUtils, 'verifyLogin').callsFake(verifyLogin);
/* end of initialization part */