const naxos = require('./naxos2.js');
const mcl = require('mcl-wasm')
const crypto = require('crypto')

class Initiator{
    constructor(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);

        this.a = new mcl.Fr();
        this.a.setByCSPRNG();

        this.A = mcl.mul(this.g, this.x)
        console.log(`A: ${this.A.getStr().slice(2)}`)
    }

    genEphKey(){
        this.X = naxos.genEphKey(this.x, this.a, this.g);
        return this.X;
    }

    genSessionKey(Y, B){
        this.sessionKey = naxos.genSessionKeyInitiator(this.a, Y, this.A, B, this.x);
        console.log(this.sessionKey.toString('base64'))
    }

    verifyCheckMsg(msgOriginal, msgEncoded){
        const encodedMsgLocal = this.createCheckMsg(msgOriginal, this.sessionKey);
        console.log(`status: ${encodedMsgLocal === msgEncoded}`)
    }

    createCheckMsg(msg){
        const hash = crypto.createHash('SHA3-512')
        hash.update(this.sessionKey);
        hash.update(msg);
        const digest = hash.digest()

        return Buffer.from(digest).toString('base64')
    }
}

module.exports = Initiator;