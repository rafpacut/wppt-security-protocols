const Responder = require('./Responder.js');
const utils = require('../utils.js');

class SigmaController{
    constructor(){
        this.bob = new Responder();
    }

    async handleInit(req, res, token){
        let X = new mcl.G1();
        X.setStr(utils.decode(req.body.payload.X));

        let [Y, B, s, Xsign, macB] = await this.bob.replyInit(X);
        const macB_b64 = utils.toBase64(macB)

        const resBody = {
            payload : {
                b_mac : macB_b64,
                B : utils.encode(B),
                Y : utils.encode(Y),
                sig : {
                    X : utils.encode(Xsign),
                    s : s.getStr()
                    //msg -- optional
                },
            },
            session_token : token 
        }
        res.locals.conWrapper.send(res, resBody);
    }

    handleExchange(req, res){
        let A = new mcl.G1();
        let s = new mcl.Fr();
        let X = new mcl.G1();

        const payload = req.body.payload;
        A.setStr(utils.decode(payload.A),10)
        s.setStr(payload.sig.s.toString(),10)
        X.setStr(utils.decode(payload.sig.X),10)

        const mac_b64 = payload.a_mac;
        const mac = Buffer.from(mac_b64, 'base64');
        //const msg = "foobar"
        const msg = payload.msg
        
        const checkMsg = this.bob.replyCheckMsg(A, s, X, mac, msg)
        const checkMsg_b64 = utils.toBase64(checkMsg);

        const resBody = {
            msg : checkMsg_b64
        }
        res.locals.conWrapper.send(res, resBody)
    }
}

module.exports = SigmaController;