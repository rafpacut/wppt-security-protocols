const utils = require("../utils.js");

function readInitPayload(reqBody){
	let A = new mcl.G1();
	let X = new mcl.G1();

	let A_decoded = utils.decode(reqBody.payload.A);
	let X_decoded = utils.decode(reqBody.payload.X);

	A.setStr(A_decoded);
	X.setStr(X_decoded);

	return [A,X];
}

function readVerifyPayload(req) {
	let s1 = new mcl.Fr();
	let s2 = new mcl.Fr();

	let [s1Str, s2Str, session_token] = [req.body.payload.s1, req.body.payload.s2, req.body.session_token];

	s1.setStr(s1Str.toString(),10);
	s2.setStr(s2Str.toString(),10);

	return [s1,s2, session_token];
}

function isSessionTokenRegistered(session_token) {
	return sessionIDs.some(e => e.id === session_token);
}

module.exports.readInitPayload = readInitPayload;
module.exports.readVerifyPayload = readVerifyPayload;
module.exports.isSessionTokenRegistered = isSessionTokenRegistered;
