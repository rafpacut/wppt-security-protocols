const utils = require('../utils.js');
const sssVerifier = require('./Verifier.js');


class SssController{
    constructor(){ 
        this.verifier;
    }

    handleInit(req, res, session_token){
        let msg = req.body.payload.msg;
        let A = new mcl.G1();
        let s = new mcl.Fr();
        let X = new mcl.G1();

        A.setStr(utils.decode(req.body.payload.A));
        X.setStr(utils.decode(req.body.payload.X));
        s.setStr(req.body.payload.s.toString(), 10);

        let verifier = new sssVerifier(A);
        let verdict = verifier.verify(msg, s, X);

        res.statusCode = (verdict)? 200 : 403;
        res.locals.conWrapper.send(res, {verified: verdict});
        console.log(`${session_token} verification status: ${verdict}`);
        utils.removeToken(session_token);
        console.log(sessionIDs);
    }

}

module.exports = SssController;