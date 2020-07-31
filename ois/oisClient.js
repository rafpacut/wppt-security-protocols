var Prover = require('./Prover.js');
const mcl = require('mcl-wasm');
const utils = require('../utils.js');

class OisClient {
	constructor(rp_wrapper){
		this.prover = new Prover();
		this.rp_wrapper = rp_wrapper;

		this.basePath = '/protocols/ois/'; 

		this.protocol_name = "ois";
		this.session_token;
	}

	sendProof(){
		let [s1, s2] = this.prover.createProof();
		let path = this.basePath+'verify';

		let reqBody = {
			protocol_name : this.protocol_name,
			session_token : this.session_token,

			payload : {
			s1 : s1.getStr(),
			s2 : s2.getStr()
			}
		};

		let options = {
			method : 'POST',
			uri: `${hostname}:${port}${path}`,
			body: reqBody,
			json: true
		};
		
		this.rp_wrapper.send(options)
		.then(res=>{
			console.log(res);
		});
	}

	init(){
		let A = this.prover.pk;
		let X = this.prover.createCommitment();

		let reqBody = {
			protocol_name : this.protocol_name,
			payload: {
				A : utils.encode(A),
				X : utils.encode(X)
			}
		};

		let path = this.basePath+'init';
		let options = {
			method : 'POST',
			uri: `${hostname}:${port}${path}`,
			body: reqBody,
			json: true
		}
		this.rp_wrapper.send(options)
		.then(res=>{
			let c = new mcl.Fr();
			c.setStr(res.payload.c.toString(), 10);
			this.prover.consumeC(c);
		
			this.session_token = res.session_token;
			this.sendProof();
		})
	}
}

module.exports = OisClient;
