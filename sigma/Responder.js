const mcl = require('mcl-wasm')
const utils = require("./utils.js")

class Responder{
    constructor(){
        this.sk = new mcl.Fr();
        this.sk.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
        this.secParam = 32;

        this.pk = mcl.mul(this.g, this.sk);

        //ephemerals:
        this.y = new mcl.Fr();
        this.y.setByCSPRNG();

        this.Y = new mcl.G1();
        this.Y = mcl.mul(this.g, this.y)
    }

    replyInit(X){
        this.X = X;
        this.gxy = new mcl.G1();
        this.gxy = mcl.mul(this.X, this.y)

        this.mac_key = utils.genMACKey(this.gxy);
        let macPk = utils.createMAC(this.mac_key, this.pk)
        const [s_b, X_b] = utils.signXY(X, this.Y, this.sk, this.pk, this.g)
        return [this.Y, this.pk, s_b, X_b, macPk];
    }

    replyCheckMsg(A, s, X, mac, msg){
        if(!utils.checkMAC(A, mac, this.mac_key)){
            throw "MAC invalid";
        }
        if(!utils.checkSignature(A, this.X, this.Y, s, X, this.g)){
            throw "signature invalid"
        }

        const sessionKey_b64 = utils.createSessionKey(this.gxy);
        console.log(`session_key: ${sessionKey_b64}`)
        return utils.createCheckMsg(sessionKey_b64, msg);
    }
}
module.exports = Responder;