const Initiator = require("./Initiator.js")
const mcl = require('mcl-wasm')
const utils = require('../utils.js')

class NaxosClient{
    constructor(rp_wrapper){
        this.initiator = new Initiator();
        this.rp_wrapper = rp_wrapper;

        this.basePath='/protocols/naxos/';
        this.protocol_name="naxos"
        this.msg="onetwothreefourfivesixseveneightnineteneleventwelvethirteenfour";
        this.B = new mcl.G1();
    }

    init(){
        let path = this.basePath + 'pkey'
        const options = {
                uri: `${hostname}:${port}${path}`,
                json: true
        };
        this.rp_wrapper.send(options)
        .then(res=>{
            this.B.setStr(utils.decode(res.B));
            this.sendEph();
        });
    }

    sendEph(){
        let X = this.initiator.genEphKey();
        let A = this.initiator.A;
        console.log(`A: ${A.getStr().slice(2)}`)
        let reqBody = {
            protocol_name : this.protocol_name,
            payload : {
                X : utils.encode(X),
                A : utils.encode(A),
                msg : this.msg
            }
        }
        
        let path = this.basePath+'exchange';
		let options = {
			method : 'POST',
			uri: `${hostname}:${port}${path}`,
			body: reqBody,
			json: true
        }
		this.rp_wrapper.send(options)
		.then(res=>{
            let Y = new mcl.G1();
            Y.setStr(utils.decode(res.payload.Y));
            const msgEncoded = res.payload.msg

            this.initiator.genSessionKey(Y, this.B);
            this.initiator.verifyCheckMsg(this.msg, msgEncoded);
        });
    }
}

module.exports = NaxosClient;