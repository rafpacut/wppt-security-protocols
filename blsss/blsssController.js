const utils = require('../utils.js');
const blsssVerifier = require('./Verifier.js');


class BlsssController{
    constructor(){ 
        this.verifier;
    }

    handleInit(req, res, session_token){
        let msg = req.body.payload.msg;
        let A = new mcl.G1();
        let sigma =  new mcl.G2();

        A.setStr(utils.decode(req.body.payload.A));
        sigma.setStr(utils.decode(req.body.payload.sigma));

        let verifier = new blsssVerifier(A);
        let verdict = verifier.verify(msg, sigma);

        res.statusCode = (verdict)? 200 : 403;
        res.locals.conWrapper.send(res, {verified: verdict});
        console.log(`${session_token} verification status: ${verdict}`);
        utils.removeToken(session_token);
        console.log(sessionIDs);
    }

}

module.exports = BlsssController;