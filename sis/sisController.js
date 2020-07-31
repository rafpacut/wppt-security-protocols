var sisVerifier = require("../sis/Verifier.js");
var utils = require("../utils.js");

class SisController{
    constructor(conWrapper){
        this.conWrapper = conWrapper;
        this.verifier;
    }

    handleInit(req,res, token){
        var A = new mcl.G1();
        var X = new mcl.G1();
        A.setStr(utils.decode(req.body.payload.A));
        X.setStr(utils.decode(req.body.payload.X));

        this.verifier = new sisVerifier(A);
        this.verifier.consumeX(X);
        var c = this.verifier.createChallenge();

        //write response
        let resBody = {
            session_token: token,
            payload: {
            c: c.getStr()
            }
        };
        res.locals.conWrapper.send(res, resBody);
    }

    handleVerify(req,res){
        let session_token = req.body.session_token;
        let s = new mcl.Fr();
        s.setStr(req.body.payload.s.toString(),10);

        let verdict = this.verifier.verify(s);
        res.statusCode = (verdict)? 200 : 403;
        res.locals.conWrapper.send(res, {verified: verdict});
        console.log(`${session_token} verification status: ${verdict}`);
        utils.removeToken(session_token);
    }

}
module.exports = SisController;