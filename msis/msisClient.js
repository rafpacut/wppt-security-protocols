var Prover = require('./Prover.js');
const mcl = require('mcl-wasm');
const utils = require('../utils.js');

class MsisClient{
    constructor(rp_wrapper){
        this.rp_wrapper = rp_wrapper;
        this.prover = new Prover();
        this.basePath='/protocols/msis';
        this.protocol_name = "ois";
        this.session_token;
    }

    init(){
        let A = this.prover.publicKey;
        let X = this.prover.createCommitment();

		let path = this.basePath+'/init';
        var options = {
            method : 'POST',
            uri: `${hostname}:${port}${path}`,
            body: {
                payload : {
                A : utils.encode(A),
                X : utils.encode(X)
                },
                protocol_name : "msis"
            },
            json: true
        }
        this.rp_wrapper.send(options)
        .then(res=>{
            let c = new mcl.Fr();
            c.setStr(res.payload.c.toString(), 10);
            this.prover.consumeC(c);

            this.session_token = res.session_token;
            this.sendProof();
        });
    }

    sendProof(){
        let S = this.prover.createProof();
		let path = this.basePath+'/verify';
        let options = {
            method : 'POST',
            uri: `${hostname}:${port}${path}`,
            body: {
                protocol_name : "msis",
                session_token : this.session_token,
                payload : {
                    S : utils.encode(S)
                }
            },
            json: true
        };

        this.rp_wrapper.send(options)
        .then(res=>{
            console.log(res);
        });
    }
}

module.exports = MsisClient;
