const mcl = require('mcl-wasm')
const utils = require("./utils.js")
const globalUtils = require("../utils.js")

class Initiator{
    constructor(){
        this.sk = new mcl.Fr();
        this.sk.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
        this.secParam = 32; 

        this.pk = mcl.mul(this.g, this.sk);
    }

    init(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X = new mcl.G1();
        this.X = mcl.mul(this.g, this.x)
        return this.X
    }

    async prepareReply(Y, B, s_b, X_b, mac){
        this.gxy = new mcl.G1();
        this.gxy = mcl.mul(Y, this.x)

        const mac_key = utils.genMACKey(this.gxy);
        if(!utils.checkMAC(B, mac, mac_key)){
            throw "MAC invalid";
        }

        if(!utils.checkSignature(B, this.X, Y, s_b, X_b, this.g)){
            throw "signature invalid"
        }

        const [s_a, X_a] = utils.signXY(this.X, Y, this.sk, this.pk, this.g);

        let mac_a = await utils.createMAC(mac_key, this.pk)
        let mac_a_b64 = Buffer(mac_a).toString('base64')

        this.msg="foobar"
        const msg_b64 = globalUtils.toBase64(this.msg)
        return [this.pk, s_a, X_a, mac_a_b64, msg_b64]
    }

    verifyCheckMsg(msg){
        const seshKey = utils.createSessionKey(this.gxy)
        console.log(`seshKey: ${seshKey}`)
        console.log(`msg: ${msg.toString('base64')}`)
        const myMsg = utils.createCheckMsg(seshKey, this.msg);
        console.log(`success: ${myMsg.equals(msg)}`);
    }
}

module.exports = Initiator;