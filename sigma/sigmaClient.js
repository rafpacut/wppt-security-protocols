const Initiator = require("./Initiator.js")
const mcl = require('mcl-wasm')
const utils = require('../utils.js')

class SigmaClient{
    constructor(rp_wrapper){
        this.initiator = new Initiator();
        this.rp_wrapper = rp_wrapper

        this.basePath='/protocols/sigma/';
        this.protocol_name="sigma"
        this.session_token;
    }

    init(){
        let X = this.initiator.init();
        let reqBody = {
            protocol_name : this.protocol_name,
            payload : {
                X : utils.encode(X)
            }
        }
        
        let path = this.basePath+'init';
		let options = {
			method : 'POST',
			uri: `${hostname}:${port}${path}`,
			body: reqBody,
			json: true
		}
		this.rp_wrapper.send(options)
		.then(res=>{
            const payload = res.payload;

            let s_b = new mcl.Fr();
            s_b.setStr(payload.sig.s.toString(), 10);

            let [Xdecoded, Bdecoded, Ydecoded] = [payload.sig.X, payload.B, payload.Y]
                                                    .map(x=> utils.decode(x));
            let X_b = new mcl.G1();
            let B = new mcl.G1();
            let Y = new mcl.G1();

            X_b.setStr(Xdecoded, 10);
            B.setStr(Bdecoded, 10);
            Y.setStr(Ydecoded, 10);

            const mac_b64 = res.payload.b_mac;
            const mac = utils.fromBase64(mac_b64);

            this.session_token = res.session_token;

            this.reply(Y, B, s_b, X_b, mac)
        })
    }
        
    async reply(Y, B, s_b, X_b, mac){
        let [pk, s_a, X_a, macA, msg_b64] = await this.initiator.prepareReply(Y, B, s_b, X_b, mac)
        let reqBody = {
            protocol_name : this.protocol_name,
            session_token : this.session_token,

            payload : {
                a_mac : macA,
                A : utils.encode(pk),
                sig : {
                    X : utils.encode(X_a),
                    s : s_a.getStr()
                },
                msg : msg_b64
            }
        };
        
        let path = this.basePath+'exchange';
        let options = {
            method : 'POST',
            uri: `${hostname}:${port}${path}`,
            body: reqBody,
            json: true
        }
        this.rp_wrapper.send(options)
        .then(res=>{
            const checkMsg_b64 = res.msg;
            const checkMsg = utils.fromBase64(checkMsg_b64);
            this.initiator.verifyCheckMsg(checkMsg);
        });
    }
}

module.exports = SigmaClient;