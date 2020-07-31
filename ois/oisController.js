const oisVerifier = require("./Verifier.js");
const utils = require("../utils.js");
const oisUtils = require('./oisUtils.js');

class OisController{
	constructor(){
		this.verifier;
	}

	handleInit(req, res, token) {
		let [A,X] = oisUtils.readInitPayload(req.body); 
		
		this.verifier = new oisVerifier(A);
		this.verifier.consumeX(X);
		let c = this.verifier.createChallenge();
		
		//write response
		let resBody = {
			session_token: token,
			payload: {
				c: c.getStr()
			}
		};
		res.locals.conWrapper.send(res, resBody);
	}

	handleVerify(req, res) {
		let [s1,s2, session_token] = oisUtils.readVerifyPayload(req);
		
		var verdict = this.verifier.verify(s1, s2);
		res.statusCode = (verdict)? 200 : 403;
		res.locals.conWrapper.send(res, {verified: verdict});
		console.log(`${session_token} verification status: ${verdict}`);

		utils.removeToken(session_token);
		console.log(sessionIDs);
	}
}

module.exports = OisController;